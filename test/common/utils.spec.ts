import mock from 'mock-fs'
import merge from 'lodash/merge.js'

import {
  getResolvedConfig,
  getInputJson,
  getResolvedInputJson,
  getReportHtmlAfterPopulatingData
} from '../../dist/common/utils.js'
import { DEFAULT_CONFIG } from '../../dist/common/constants.js'
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
      'cypress-image-diff-html-report.json': mock.load(
        'test/fixtures/cypress-image-diff-html-report.json'
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
      expect(config).toStrictEqual(
        merge({}, DEFAULT_CONFIG, { serverPort: 5001 })
      )
    })

    it('should return correct merge config when only configFile given', async () => {
      const config = await getResolvedConfig({ configFile: 'my-config.js' })
      expect(config).toStrictEqual(
        merge({}, DEFAULT_CONFIG, {
          reportJsonFilePath: './test.json',
          outputDir: 'my-html-report',
          autoOpen: true,
          serverPort: 6001
        })
      )
    })

    it('should return correct merge config when configFile and other properties given', async () => {
      const config = await getResolvedConfig({
        configFile: 'my-config.js',
        outputDir: 'output'
      })
      expect(config).toStrictEqual(
        merge({}, DEFAULT_CONFIG, {
          reportJsonFilePath: './test.json',
          outputDir: 'output',
          autoOpen: true,
          serverPort: 6001
        })
      )
    })
  })

  describe('getInputJson', () => {
    it('should return input json from given path', async () => {
      let json!: Report
      try {
        json = await getInputJson('cypress-image-diff-html-report.json')
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

  describe('getResolvedInputJson', () => {
    it('should return resolved input json in served mode with default config', async () => {
      let json!: Report
      try {
        json = await getResolvedInputJson(
          {
            reportJsonFilePath: 'cypress-image-diff-html-report.json',
            outputDir: 'cypress-image-diff-html-report',
            baseDir: '',
            inlineAssets: false,
            autoOpen: false,
            serverPort: 6868
          },
          'served'
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

    it('should return resolved input json in served mode with custom config', async () => {
      let json!: Report
      try {
        json = await getResolvedInputJson(
          {
            reportJsonFilePath: 'cypress-image-diff-html-report.json',
            outputDir: 'my-report/html',
            baseDir: 'visual-test',
            inlineAssets: false,
            autoOpen: false,
            serverPort: 6868
          },
          'served'
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
            path: 'visual-test/cypress/specs/image-diff.cy.js',
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
        json = await getResolvedInputJson(
          {
            reportJsonFilePath: 'cypress-image-diff-html-report.json',
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
            path: '../cypress/specs/image-diff.cy.js',
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
        json = await getResolvedInputJson(
          {
            reportJsonFilePath: 'cypress-image-diff-html-report.json',
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
            path: '../../visual-test/cypress/specs/image-diff.cy.js',
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
        json = await getResolvedInputJson(
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
