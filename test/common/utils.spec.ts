import mock from 'mock-fs'

import {
  getResolvedConfig,
  getReportJson,
  getResolvedReportJson,
  getReportHtmlAfterPopulatingData
} from '../../dist/common/utils.js'
import { Report } from '../../dist/common/types.js'

describe('Utils', () => {
  beforeEach(() => {
    mock({
      node_modules: mock.load('node_modules'),
      dist: mock.load('dist'),
      'cypress-visual-screenshots': mock.load(
        'playground/cypress-visual-screenshots'
      ),
      'package.json': mock.load('package.json'),
      'cypress-image-diff-html-report.config.js': mock.load(
        'test/fixtures/cypress-image-diff-html-report.config.js'
      ),
      'cypress-image-diff-html-report/report_29-10-2023_165108.json': mock.load(
        'test/fixtures/cypress-image-diff-html-report/report_29-10-2023_165108.json'
      ),
      'my-config.js': mock.load('test/fixtures/my-config.js'),
      'test.json': mock.load('test/fixtures/test.json')
    })
  })

  afterEach(() => {
    mock.restore()
  })

  describe('getResolvedConfig', () => {
    it('should return default config when no config found', async () => {
      const config = await getResolvedConfig()
      expect(config).toMatchSnapshot()
    })

    it('should return correct merge config when only configFile given', async () => {
      const config = await getResolvedConfig({ configFile: 'my-config.js' })
      expect(config).toMatchSnapshot()
    })

    it('should return correct merge config when configFile and other properties given', async () => {
      const config = await getResolvedConfig({
        configFile: 'my-config.js',
        outputDir: 'output'
      })
      expect(config).toMatchSnapshot()
    })
  })

  describe('getReportJson', () => {
    it('should return input json from given path', async () => {
      let json!: Report
      try {
        json = await getReportJson(
          'cypress-image-diff-html-report/report_29-10-2023_165108.json'
        )
      } catch {
        /* empty */
      }

      const expectedJson = {
        total: 6,
        totalPassed: 3,
        totalFailed: 3,
        totalSuites: 3,
        suites: [
          {
            name: 'image-diff.cy.js',
            path: 'cypress/specs/image-diff.cy.js',
            tests: []
          }
        ],
        startedAt: '2023-09-19T13:15:11.806Z',
        endedAt: '2023-09-19T13:15:31.112Z',
        duration: 15239,
        browserName: 'chrome',
        browserVersion: '116.0.5845.187',
        cypressVersion: '10.8.0'
      }

      expect(json).toStrictEqual(expectedJson)
    })
  })

  describe('getResolvedReportJson', () => {
    it('should return resolved input json in local mode with default config', async () => {
      let json!: Report
      try {
        json = await getResolvedReportJson(
          {
            reportJsonFilePath:
              'cypress-image-diff-html-report/report_29-10-2023_165108.json',
            outputDir: 'cypress-image-diff-html-report',
            baseDir: '',
            inlineAssets: false,
            autoOpen: false,
            serverPort: 6868
          },
          'local'
        )
      } catch {
        /* empty */
      }

      const expectedJson = {
        total: 6,
        totalPassed: 3,
        totalFailed: 3,
        totalSuites: 3,
        suites: [
          {
            name: 'image-diff.cy.js',
            path: 'cypress/specs/image-diff.cy.js',
            id: 'cypress/specs/image-diff.cy.js',
            passed: 0,
            failed: 0,
            tests: []
          }
        ],
        startedAt: '2023-09-19T13:15:11.806Z',
        endedAt: '2023-09-19T13:15:31.112Z',
        duration: 15239,
        browserName: 'chrome',
        browserVersion: '116.0.5845.187',
        cypressVersion: '10.8.0'
      }

      expect(json).toStrictEqual(expectedJson)
    })

    it('should return resolved input json in local mode with custom config', async () => {
      let json!: Report
      try {
        json = await getResolvedReportJson(
          {
            reportJsonFilePath:
              'cypress-image-diff-html-report/report_29-10-2023_165108.json',
            outputDir: 'my-report/html',
            baseDir: 'visual-test',
            inlineAssets: false,
            autoOpen: false,
            serverPort: 6868
          },
          'local'
        )
      } catch {
        /* empty */
      }

      const expectedJson = {
        total: 6,
        totalPassed: 3,
        totalFailed: 3,
        totalSuites: 3,
        suites: [
          {
            name: 'image-diff.cy.js',
            path: 'cypress/specs/image-diff.cy.js',
            id: 'cypress/specs/image-diff.cy.js',
            passed: 0,
            failed: 0,
            tests: []
          }
        ],
        startedAt: '2023-09-19T13:15:11.806Z',
        endedAt: '2023-09-19T13:15:31.112Z',
        duration: 15239,
        browserName: 'chrome',
        browserVersion: '116.0.5845.187',
        cypressVersion: '10.8.0'
      }

      expect(json).toStrictEqual(expectedJson)
    })

    it('should return resolved input json in static mode with default config', async () => {
      let json!: Report
      try {
        json = await getResolvedReportJson(
          {
            reportJsonFilePath:
              'cypress-image-diff-html-report/report_29-10-2023_165108.json',
            outputDir: 'cypress-image-diff-html-report',
            baseDir: '',
            inlineAssets: false,
            autoOpen: false,
            serverPort: 6868
          },
          'static'
        )
      } catch {
        /* empty */
      }

      const expectedJson = {
        total: 6,
        totalPassed: 3,
        totalFailed: 3,
        totalSuites: 3,
        suites: [
          {
            name: 'image-diff.cy.js',
            path: 'cypress/specs/image-diff.cy.js',
            id: 'cypress/specs/image-diff.cy.js',
            passed: 0,
            failed: 0,
            tests: []
          }
        ],
        startedAt: '2023-09-19T13:15:11.806Z',
        endedAt: '2023-09-19T13:15:31.112Z',
        duration: 15239,
        browserName: 'chrome',
        browserVersion: '116.0.5845.187',
        cypressVersion: '10.8.0'
      }

      expect(json).toStrictEqual(expectedJson)
    })

    it('should return resolved input json in static mode with custom config', async () => {
      let json!: Report
      try {
        json = await getResolvedReportJson(
          {
            reportJsonFilePath:
              'cypress-image-diff-html-report/report_29-10-2023_165108.json',
            outputDir: 'my-report/html',
            baseDir: 'visual-test',
            inlineAssets: false,
            autoOpen: false,
            serverPort: 6868
          },
          'static'
        )
      } catch {
        /* empty */
      }

      const expectedJson = {
        total: 6,
        totalPassed: 3,
        totalFailed: 3,
        totalSuites: 3,
        suites: [
          {
            name: 'image-diff.cy.js',
            path: 'cypress/specs/image-diff.cy.js',
            id: 'cypress/specs/image-diff.cy.js',
            passed: 0,
            failed: 0,
            tests: []
          }
        ],
        startedAt: '2023-09-19T13:15:11.806Z',
        endedAt: '2023-09-19T13:15:31.112Z',
        duration: 15239,
        browserName: 'chrome',
        browserVersion: '116.0.5845.187',
        cypressVersion: '10.8.0'
      }

      expect(json).toStrictEqual(expectedJson)
    })

    it('should return resolved input json in static mode with inlineAssets', async () => {
      let json!: Report
      try {
        json = await getResolvedReportJson(
          {
            reportJsonFilePath: 'test.json',
            outputDir: 'my-report/html',
            baseDir: '',
            inlineAssets: true,
            autoOpen: false,
            serverPort: 6868
          },
          'static'
        )
      } catch (err) {
        /* empty */
      }

      expect(json).toMatchSnapshot()
    })
  })

  describe('getReportHtmlAfterPopulatingData', () => {
    it('should return output html from given json', async () => {
      const json = {
        total: 6,
        totalPassed: 3,
        totalFailed: 3,
        totalSuites: 3,
        suites: [
          {
            name: 'image-diff.cy.js',
            path: 'cypress/specs/image-diff.cy.js',
            id: 'cypress/specs/image-diff.cy.js',
            failed: 0,
            passed: 0,
            tests: []
          }
        ],
        startedAt: '2023-09-19T13:15:11.806Z',
        endedAt: '2023-09-19T13:15:31.112Z',
        duration: 15239,
        browserName: 'chrome',
        browserVersion: '116.0.5845.187',
        cypressVersion: '10.8.0'
      }

      let html: string
      try {
        html = await getReportHtmlAfterPopulatingData(json)
      } catch {
        html = ''
      }

      const expectedHtml = `<script id="injected-data">window.__injectedData__ = ${JSON.stringify(
        { report: json, mode: 'static' }
      )}</script>`

      expect(html).toEqual(expect.stringContaining(expectedHtml))
    })
  })
})
