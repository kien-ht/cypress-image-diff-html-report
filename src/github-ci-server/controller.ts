// import { Probot } from 'probot'
import AdmZip from 'adm-zip'
import {
  CiTestIdentity,
  ResolvedReport,
  CheckRunInstance
} from '../common/types.js'
import { App as OctokitApp } from 'octokit'
import {
  getProbotConfig,
  getResolvedConfig,
  getResolvedInputJson
} from '../common/utils.js'

export class CiController {
  private app: OctokitApp

  constructor() {
    this.app = new OctokitApp(getProbotConfig())
  }

  async getReports(instance: CheckRunInstance): Promise<ResolvedReport> {
    const { installationId, owner, repo, workflowId } = instance
    const octokit = await this.app.getInstallationOctokit(installationId)
    const { data } = await octokit.request(
      `GET /repos/${owner}/${repo}/actions/runs/${workflowId}/artifacts`,
      {
        owner,
        repo,
        run_id: workflowId
      }
    )

    if (data.artifacts.length === 0)
      return Promise.reject('Not found artifacts')

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
    admZip.extractAllTo('./', true)

    const config = await getResolvedConfig({
      reportJsonDir: 'cypress-image-diff-html-report',
      reportJsonFilePath: undefined,
      outputDir: 'cypress-image-diff-html-report',
      baseDir: '',
      inlineAssets: false,
      autoOpen: false,
      serverPort: 6868
    })
    return getResolvedInputJson(config)
  }

  async updateTest(testId: CiTestIdentity) {
    console.log(testId)
  }
}
