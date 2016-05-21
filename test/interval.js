'use strict'

const { Interval, Date } = require('..')

describe('Interval', () => {

  describe('bounds', () => {
    it('min', () => {
      expect(new Interval([2001], [2003]).min)
        .to.eql(Date.UTC(2001, 0, 1, 0, 0, 0, 0))
    })

    it('max', () => {
      expect(new Interval([2001], [2003]).max)
        .to.eql(Date.UTC(2003, 11, 31, 23, 59, 59, 999))
    })
  })

  describe('iteration', () => {
    const Q1_94 = new Interval([1994, 0], [1994, 2])
    const FEB_94 = new Date(1994, 1)
    const FEB1_94 = new Date(1994, 1, 1)
    const YEAR_94 = new Date([1994])

    it('@@iterator', () => {
      expect([...new Interval([2001], [2003])].map(v => v.edtf))
        .to.eql(['2001', '2002', '2003'])

      expect([...Q1_94].map(v => v.edtf))
        .to.eql(['1994-01', '1994-02', '1994-03'])
    })

    it('covers', () => {
      expect(Q1_94.covers(FEB_94)).to.be.true
      expect(Q1_94.covers(FEB1_94)).to.be.true
      expect(Q1_94.covers(YEAR_94)).not.to.be.true
    })

    it('includes', () => {
      expect(Q1_94.includes(FEB_94)).to.be.true
      expect(Q1_94.includes(FEB1_94)).not.to.be.true
      expect(Q1_94.includes(YEAR_94)).not.to.be.true
    })
  })

  describe('.edtf', () => {
    it('default', () =>
      expect(new Interval().edtf).to.eql('/'))
  })
})
