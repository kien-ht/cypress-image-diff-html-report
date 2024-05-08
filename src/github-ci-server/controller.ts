import { ProbotOctokit } from 'probot'
import AdmZip from 'adm-zip'
import {
  UpdateBaselines,
  ResolvedReport,
  WorkflowInstance,
  Report,
  DownloadArtifactsOptions,
  GetSnapshotsHashed,
  HashedSnapshotToUpdate
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

  async getReports(instance: WorkflowInstance): Promise<ResolvedReport> {
    const octokit = await this.app.getInstallationOctokit(
      instance.installationId
    )
    const report = await downloadArtifacts(instance, octokit)
    return getReportJsonWithTotalStats(report)
  }

  async updateBaselines({ instance, snapshots }: UpdateBaselines) {
    const { installationId, owner, repo, sha, ref } = instance

    const octokit = await this.app.getInstallationOctokit(installationId)

    const hashSnapshotToUpdate = await getSnapshotsHashes(
      {
        owner: instance.owner,
        repo: instance.repo,
        snapshots
      },
      octokit
    )

    // get a new tree
    const { data } = await octokit.request(
      `POST /repos/${owner}/${repo}/git/trees`,
      {
        owner,
        repo,
        base_tree: sha,
        tree: hashSnapshotToUpdate.map((s) => ({
          path: s.baselinePath,
          sha: s.sha,
          mode: '100644',
          type: 'blob'
        }))
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

export async function getSnapshotsHashes(
  { owner, repo, snapshots }: GetSnapshotsHashed,
  octokit: Octokit | ProbotOctokit
): Promise<HashedSnapshotToUpdate[]> {
  try {
    const hashes = await Promise.all(
      snapshots.map(async (snapshot) => {
        const content =
          snapshot.comparisonDataUrl.split(',')[1] ?? snapshot.comparisonDataUrl
        const { data } = await octokit.request(
          `POST /repos/${owner}/${repo}/git/blobs`,
          {
            owner,
            repo,
            content,
            encoding: 'base64'
          }
        )
        return { baselinePath: snapshot.baselinePath, sha: data.sha as string }
      })
    )

    return hashes
  } catch (err) {
    return Promise.reject(err)
  }
}
