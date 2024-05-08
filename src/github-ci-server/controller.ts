import { ProbotOctokit } from 'probot'
import AdmZip from 'adm-zip'
import {
  CiTestIdentity,
  ResolvedReport,
  CheckRunInstance,
  Report,
  DownloadArtifactsOptions
} from '../common/types.js'
import { App as OctokitApp, Octokit } from 'octokit'
import {
  getProbotConfig,
  getReportJsonWithTotalStats
} from '../common/utils.js'

export class CiController {
  private app: OctokitApp

  constructor() {
    this.app = new OctokitApp(getProbotConfig())
  }

  async getReports(instance: CheckRunInstance): Promise<ResolvedReport> {
    const octokit = await this.app.getInstallationOctokit(
      instance.installationId
    )
    const report = await downloadArtifacts(instance, octokit)
    return getReportJsonWithTotalStats(report)
  }

  async updateTest(test: CiTestIdentity) {
    test
    const image =
      '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'

    const { installationId, owner, repo, sha, ref } = {
      installationId: 46300636,
      owner: 'kien-ht',
      repo: 'test-github-app',
      sha: 'a61160e4269620d8c78cf80596b1845d36c95e95',
      ref: 'test-url'
    }

    const octokit = await this.app.getInstallationOctokit(installationId)

    // create a blob
    const { data: blobData } = await octokit.request(
      `POST /repos/${owner}/${repo}/git/blobs`,
      {
        owner,
        repo,
        content: image,
        encoding: 'base64'
      }
    )

    // get a new tree
    const { data } = await octokit.request(
      `POST /repos/${owner}/${repo}/git/trees`,
      {
        owner,
        repo,
        base_tree: sha,
        tree: [
          {
            path: 'test.png',
            mode: '100644',
            type: 'blob',
            sha: blobData.sha
          }
        ]
      }
    )

    // commit
    const { data: commitData } = await octokit.request(
      `POST /repos/${owner}/${repo}/git/commits`,
      {
        owner,
        repo,
        message: 'cypress-image-diff: update baselines',
        tree: data.sha,
        parents: [sha]
      }
    )

    // push
    const branch = `heads/${ref}`
    const { data: pushData } = await octokit.request(
      `PATCH /repos/${owner}/${repo}/git/refs/${branch}`,
      {
        owner,
        repo,
        ref: branch,
        sha: commitData.sha
      }
    )

    console.log(pushData)
  }
}

export async function downloadArtifacts(
  instance: DownloadArtifactsOptions,
  octokit: Octokit | ProbotOctokit
): Promise<Report> {
  const { owner, repo, workflowId } = instance
  const { data } = await octokit.request(
    `GET /repos/${owner}/${repo}/actions/runs/${workflowId}/artifacts`,
    {
      owner,
      repo,
      run_id: workflowId
    }
  )

  if (data.artifacts.length === 0) return Promise.reject('Not found artifacts')

  const artifact = data.artifacts[0]

  const { data: zip } = await octokit.request(
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

  if (!report) return Promise.reject('Not found report')

  return JSON.parse(report.getData().toString())
}
