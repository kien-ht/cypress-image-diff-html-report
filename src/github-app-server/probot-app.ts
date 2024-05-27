import { Probot } from 'probot'
import { downloadArtifacts } from './controller.js'
import {
  GITHUB_APP_NAME,
  GITHUB_APP_WORKFLOW_PATH
} from '../common/constants.js'
import { DetailsUrlQuery, GithubCommitState } from '../common/types.js'

export const appFn = (app: Probot) => {
  // Mark the last pending commit status as skipped if any new push
  app.on('pull_request.synchronize', async (context): Promise<void> => {
    const owner = context.payload.repository.owner.login
    const repo = context.payload.repository.name
    const sha = context.payload.pull_request.head.sha

    try {
      // Get the last commit before this new commit
      const { data: getCommitsData } =
        await context.octokit.rest.repos.getCommit({ owner, repo, ref: sha })

      if (!getCommitsData.parents[0]?.sha) return

      const lastSha = getCommitsData.parents[0].sha

      const { data } = await context.octokit.rest.repos.getCombinedStatusForRef(
        { owner, repo, ref: lastSha }
      )
      const lastCommitStatus = data.statuses
        .filter((s) => s.context === GITHUB_APP_NAME)
        .pop()
      if (lastCommitStatus?.state === 'pending') {
        await context.octokit.rest.repos.createCommitStatus({
          owner,
          repo,
          sha: lastSha,
          state: 'success',
          description: 'Skipped: Visual Regression Test',
          context: GITHUB_APP_NAME
        })
      }
    } catch (err) {
      console.log(err)
    }
  })

  // Create a new commit status
  app.on('workflow_run.requested', async (context): Promise<void> => {
    if (context.payload.workflow_run.path !== GITHUB_APP_WORKFLOW_PATH) return

    const owner = context.payload.repository.owner.login
    const repo = context.payload.repository.name
    const head_sha = context.payload.workflow_run.head_sha

    try {
      await context.octokit.rest.repos.createCommitStatus({
        owner,
        repo,
        sha: head_sha,
        state: 'pending',
        description: 'Visual Regression Test',
        context: GITHUB_APP_NAME
      })
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
    let state: GithubCommitState

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
        description =
          totalFailed === 1
            ? `A visual change needs review`
            : `${totalFailed} visual changes need review`
      }
    } catch (err) {
      state = 'error'
      description = typeof err === 'string' ? err : 'Something went wrong...'
    }

    try {
      const pullRequest = context.payload.workflow_run.pull_requests.find(
        (p) => p.head.ref === ref
      )!
      const rawQuery: DetailsUrlQuery = {
        installationId,
        owner,
        repo,
        sha,
        ref,
        workflowId,
        // only for the UI
        pullNumber: pullRequest.number,
        targetRef: pullRequest.base.ref,
        author: context.payload.workflow_run.actor.login,
        authorAvatar: context.payload.workflow_run.actor.avatar_url
      }
      const queryString = new URLSearchParams(
        Object.entries(rawQuery).map(([k, v]) => [k, String(v)])
      ).toString()

      await context.octokit.rest.repos.createCommitStatus({
        owner,
        repo,
        sha,
        state,
        description,
        context: GITHUB_APP_NAME,
        target_url: `${process.env.GITHUB_APP_DOMAIN}/details?${queryString}`
      })
    } catch (err) {
      console.log(err)
    }
  })
}
