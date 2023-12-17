/// <reference types="cypress" />

describe('examples', () => {
  it('take home page screenshot', () => {
    cy.visit('/')
    cy.compareSnapshot('home-page')
  })
})
