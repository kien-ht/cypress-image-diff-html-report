import { Probot } from 'probot'
import AdmZip from 'adm-zip'

export default (app: Probot) => {
  // Create a new checkrun
  app.on(
    ['pull_request.opened', 'pull_request.synchronize'],
    async (context): Promise<void> => {
      const owner = context.payload.repository.owner.login
      const repo = context.payload.repository.name
      const head_sha = context.payload.pull_request.head.sha

      try {
        await context.octokit.request(
          `POST /repos/${owner}/${repo}/check-runs`,
          {
            owner,
            repo,
            name: 'cypress-image-diff',
            head_sha,
            status: 'in_progress',
            // details_url: '',
            started_at: new Date().toISOString(),
            output: {
              title: 'Visual Regression Test',
              summary: 'processing...',
              text: ''
            }
          }
        )
      } catch (err) {
        console.log(err)
      }
    }
  )

  // Skip the last checkrun if there is a new push
  app.on('check_run.created', async (context): Promise<void> => {
    const owner = context.payload.repository.owner.login
    const repo = context.payload.repository.name
    const lastRef = context.payload.check_run.check_suite.before

    try {
      const { data } = await context.octokit.request(
        `GET /repos/${owner}/${repo}/commits/${lastRef}/check-runs`,
        {
          owner,
          repo,
          ref: lastRef
        }
      )

      const lastCheckRun = data.check_runs.find(
        (c: Record<string, Record<string, string>>) =>
          c.app.slug === 'cypress-image-diff'
      )
      if (lastCheckRun && lastCheckRun.status === 'in_progress') {
        await context.octokit.request(
          `PATCH /repos/${owner}/${repo}/check-runs/${lastCheckRun.id}`,
          {
            owner,
            repo,
            check_run_id: lastCheckRun.id,
            name: 'cypress-image-diff',
            // details_url: '',
            status: 'completed',
            conclusion: 'skipped',
            completed_at: new Date().toISOString(),
            output: {
              title: 'Visual Regression Test',
              summary: 'Skipped..'
            }
          }
        )
      }
    } catch (err) {
      console.log(err)
    }
  })

  // Update checkrun status
  app.on('workflow_run.completed', async (context): Promise<void> => {
    // make sure to download artifacts from "my test" only
    if (context.payload.workflow_run.path !== '.github/workflows/test.yml')
      return

    const owner = context.payload.repository.owner.login
    const repo = context.payload.repository.name
    const ref = context.payload.workflow_run.head_sha

    const { data } = await context.octokit.request(
      `GET /repos/${owner}/${repo}/commits/${ref}/check-runs`,
      {
        owner,
        repo,
        ref
      }
    )

    const checkRun = data.check_runs.find(
      (c: Record<string, Record<string, string>>) =>
        c.app.slug === 'cypress-image-diff'
    )

    // update checkrun status
    if (checkRun && checkRun.status === 'in_progress') {
      const { data: workflowData } = await context.octokit.request(
        `GET /repos/${owner}/${repo}/actions/runs`,
        {
          owner,
          repo,
          head_sha: ref
        }
      )
      const testWorkflow = workflowData.workflow_runs.find(
        (c: Record<string, string>) => c.path === '.github/workflows/test.yml'
      )!
      // Access the artifacts
      const { data } = await context.octokit.request(
        `GET /repos/${owner}/${repo}/actions/runs/${testWorkflow.id}/artifacts`,
        {
          owner,
          repo,
          run_id: testWorkflow.id
        }
      )

      if (data.artifacts.length === 0) return

      const artifact = data.artifacts[0]

      const { data: zip } = await context.octokit.request(
        `GET /repos/${owner}/${repo}/actions/artifacts/${artifact.id}/zip`,
        {
          owner,
          repo,
          artifact_id: artifact.id,
          archive_format: 'zip'
        }
      )

      const admZip = new AdmZip(Buffer.from(zip))
      const report = admZip.getEntries().find((z) => /\.json$/.test(z.name))

      if (!report) return

      const { totalFailed } = JSON.parse(report.getData().toString())

      // evaluate status
      await context.octokit.checks.update({
        owner,
        repo,
        check_run_id: checkRun.id,
        status: 'completed',
        conclusion: totalFailed > 0 ? 'action_required' : 'success',
        completed_at: new Date().toISOString(),
        output: {
          title:
            totalFailed > 0
              ? `${totalFailed} visual change(s) need review`
              : 'All tests passed! 🚀',
          summary: ''
        }
      })
    }
  })
}
