// import { jest } from '@jest/globals'
import fs from 'fs-extra'
import mock from 'mock-fs'
import path from 'path'
import request from 'supertest'
import { generate, startServer } from '../dist/index.js'
import http from 'http'
import { AddressInfo } from 'net'

describe('Core', () => {
  beforeEach(() => {
    mock({
      'dist/ui/index.html': mock.load('dist/ui/index.html'),
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

  describe('Generate HTML report', () => {
    it('should create HTML report with given inputJsonPath', async () => {
      try {
        await generate({ inputJsonPath: 'test.json' })
      } catch (e) {
        /* empty */
      }

      const inputJson = JSON.parse(
        await fs.readFile(path.join(process.cwd(), 'test.json'), {
          encoding: 'utf8'
        })
      )

      const expectedHtml = await fs.readFile(
        path.join(process.cwd(), 'cypress-image-diff-html-report/index.html'),
        { encoding: 'utf8' }
      )

      expect(expectedHtml).toEqual(
        expect.stringContaining(
          `<script id="input-json">window.__input_json__ = ${JSON.stringify(
            inputJson
          )}</script>`
        )
      )
    })

    it('should create HTML report with given outputDir', async () => {
      try {
        await generate({ outputDir: 'my-html-report' })
      } catch {
        /* empty */
      }

      const expectedPath = path.join(process.cwd(), 'my-html-report/index.html')
      expect(fs.existsSync(expectedPath)).toBe(true)
    })
  })

  describe('Start the local server', () => {
    let server = new http.Server()

    afterEach(() => {
      server.close()
    })

    it('should serve /', async () => {
      try {
        server = await startServer()
      } catch {
        /* empty */
      }
      const response = await request(server).get('/')
      expect(response.statusCode).toBe(200)
    })

    it('should serve /api/reports', async () => {
      try {
        server = await startServer()
      } catch {
        /* empty */
      }
      const response = await request(server).get('/api/reports')
      expect(response.statusCode).toBe(200)
    })

    it('should start local server with given inputJsonPath', async () => {
      try {
        server = await startServer({ inputJsonPath: 'test.json' })
      } catch {
        /* empty */
      }

      const expectedJson = JSON.parse(
        await fs.readFile(path.join(process.cwd(), 'test.json'), {
          encoding: 'utf8'
        })
      )
      const response = await request(server).get('/api/reports')

      expect(response.statusCode).toBe(200)
      expect(response.type).toBe('application/json')
      expect(JSON.stringify(response.body)).toBe(JSON.stringify(expectedJson))
    })

    it('should start local server with given autoOpen', async () => {
      // try {
      //   server = await startServer({ autoOpen: true })
      // } catch {
      //   /* empty */
      // }
      // expect(mockedOpen).toHaveBeenCalledTimes(1)
    })

    it('should start local server with given serverPort', async () => {
      try {
        server = await startServer({ serverPort: 4001 })
      } catch {
        /* empty */
      }

      expect((server.address() as AddressInfo).port).toBe(4001)
    })
  })
})