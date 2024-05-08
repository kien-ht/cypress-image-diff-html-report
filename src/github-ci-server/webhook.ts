import { Probot } from 'probot'
import { downloadArtifacts } from './controller.js'
import {
  GITHUB_APP_NAME,
  GITHUB_APP_WORKFLOW_PATH
} from '../common/constants.js'

export default (app: Probot) => {
  // Mark the last pending commit status as skipped if any new push
  app.on('pull_request.synchronize', async (context): Promise<void> => {
    const owner = context.payload.repository.owner.login
    const repo = context.payload.repository.name
    const sha = context.payload.pull_request.head.sha

    try {
      // Get the last commit before this new commit
      const { data: getCommitsData } = await context.octokit.request(
        `GET /repos/${owner}/${repo}/commits/${sha}`,
        { owner, repo, ref: sha }
      )

      if (!getCommitsData.parents?.[0].sha) return

      const lastSha = getCommitsData.parents?.[0].sha

      const { data } = await context.octokit.request(
        `GET /repos/${owner}/${repo}/commits/${lastSha}/status`,
        { owner, repo, ref: lastSha }
      )

      if (
        data.statuses.findLast(
          (s: Record<string, string>) => s.context === GITHUB_APP_NAME
        )?.state === 'pending'
      ) {
        await context.octokit.request(
          `POST /repos/${owner}/${repo}/statuses/${lastSha}`,
          {
            owner,
            repo,
            sha: lastSha,
            state: 'success',
            description: 'Skipped: Visual Regression Test',
            context: GITHUB_APP_NAME
          }
        )
      }
    } catch (err) {
      console.log(err)
    }
  })

  // Create a new commit status
  app.on('workflow_run.requested', async (context): Promise<void> => {
    if (context.payload.workflow_run.path !== GITHUB_APP_WORKFLOW_PATH) return

    const installationId = context.payload.installation!.id
    const owner = context.payload.repository.owner.login
    const repo = context.payload.repository.name
    const head_sha = context.payload.workflow_run.head_sha
    const ref = context.payload.workflow_run.head_branch
    const workflowId = context.payload.workflow_run.id

    try {
      const query = {
        installationId,
        owner,
        repo,
        sha: head_sha,
        ref,
        workflowId
      }

      await context.octokit.request(
        `POST /repos/${owner}/${repo}/statuses/${head_sha}`,
        {
          owner,
          repo,
          sha: head_sha,
          state: 'pending',
          target_url:
            'http://localhost:6867/details?' +
            new URLSearchParams(
              Object.entries(query).map(([k, v]) => [k, String(v)])
            ).toString(),
          description: 'Visual Regression Test',
          context: GITHUB_APP_NAME
        }
      )
    } catch (err) {
      console.log(err)
    }
  })

  // Update commit status
  app.on('workflow_run.completed', async (context): Promise<void> => {
    if (context.payload.workflow_run.path !== GITHUB_APP_WORKFLOW_PATH) return

    const installationId = context.payload.installation!.id
    const owner = context.payload.repository.owner.login
    const repo = context.payload.repository.name
    const sha = context.payload.workflow_run.head_sha
    const workflowId = context.payload.workflow_run.id
    const ref = context.payload.workflow_run.head_branch

    let description: string
    let state: string

    try {
      const { totalFailed } = await downloadArtifacts(
        { owner, repo, workflowId },
        context.octokit
      )

      if (totalFailed === 0) {
        state = 'success'
        description = 'All tests passed!'
      } else {
        state = 'failure'
        description = `${totalFailed} visual change(s) need review`
      }
    } catch (err) {
      state = 'error'
      description = typeof err === 'string' ? err : 'Something went wrong...'
    }

    try {
      const query = {
        installationId,
        owner,
        repo,
        sha,
        ref,
        workflowId
      }
      await context.octokit.request(
        `POST /repos/${owner}/${repo}/statuses/${sha}`,
        {
          owner,
          repo,
          sha,
          state,
          description,
          context: GITHUB_APP_NAME,
          target_url:
            'http://localhost:6867/details?' +
            new URLSearchParams(
              Object.entries(query).map(([k, v]) => [k, String(v)])
            ).toString()
        }
      )
    } catch (err) {
      console.log(err)
    }
  })
}
