import mock from 'mock-fs'
import merge from 'lodash/merge.js'

import {
  getResolvedConfig,
  getInputJson,
  getReportHtmlAfterPopulatingInput
} from '../../dist/common/utils.js'
import { DEFAULT_CONFIG } from '../../dist/common/constants.js'
import { Report } from '../../dist/common/types.js'

describe('Utils', () => {
  beforeEach(() => {
    mock({
      node_modules: mock.load('node_modules'),
      dist: mock.load('dist'),
      'package.json': mock.load('package.json'),
      'cypress-image-diff-html-report.config.js': mock.load(
        'test/fixtures/cypress-image-diff-html-report.config.js'
      ),
      'cypress-image-diff-html-report.input.json': mock.load(
        'test/fixtures/cypress-image-diff-html-report.input.json'
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
          inputJsonPath: './test.json',
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
          inputJsonPath: './test.json',
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
        json = await getInputJson('cypress-image-diff-html-report.input.json')
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

  describe('getReportHtmlAfterPopulatingInput', () => {
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
      let html!: string

      try {
        html = await getReportHtmlAfterPopulatingInput(json)
      } catch {
        /* empty */
      }

      const expectedHtml = `<script id="input-json">window.__input_json__ = ${JSON.stringify(
        json
      )}</script>`

      expect(html).toEqual(expect.stringContaining(expectedHtml))
    })
  })
})
