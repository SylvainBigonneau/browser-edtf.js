'use strict'

const { Bitmask } = require('..')

describe('Bitmask', () => {

  describe('instance', () => {
    let bm
    beforeEach(() => bm = new Bitmask())

    it('is zero by default', () => {
      expect(bm.value).to.equal(0)
      expect(bm.test()).to.equal(0)
      expect(bm.test('day')).to.equal(0)
      expect(bm.test('month')).to.equal(0)
      expect(bm.test('year')).to.equal(0)
    })

    describe('.mask()', () => {
      it('YYYYMMXX', () =>
        expect(bm.set('day').mask().join('')).to.eql('YYYYMMXX'))

      it('YYYYXXDD', () =>
        expect(bm.set('month').mask().join('')).to.eql('YYYYXXDD'))

      it('XXXXMMDD', () =>
        expect(bm.set('year').mask().join('')).to.eql('XXXXMMDD'))
    })

    describe('.toString()', () => {
      it('YYYY-MM-DD', () =>
        expect(bm.toString()).to.eql('YYYY-MM-DD'))

      it('YYYY-MM-XX', () =>
        expect(bm.set('day').toString()).to.eql('YYYY-MM-XX'))
    })
  })

  describe('.max()', () => {
    it('year', () => {
      expect(new Bitmask().max(['2016'])).to.eql([2016])
      expect(new Bitmask('year').max(['2016'])).to.eql([9999])
      expect(new Bitmask('yxyxmmdd').max(['2016'])).to.eql([2919])
    })

    it('month', () => {
      expect(new Bitmask().max(['2016', '01'])).to.eql([2016, 0])
      expect(new Bitmask('yyyyxxdd').max(['2016', '01'])).to.eql([2016, 11])
      expect(new Bitmask('yyyymxdd').max(['2016', '01'])).to.eql([2016, 8])
      expect(new Bitmask('yyyymxdd').max(['2016', '10'])).to.eql([2016, 11])
      expect(new Bitmask('yyyyxmdd').max(['2016', '01'])).to.eql([2016, 10])
      expect(new Bitmask('yyyyxmdd').max(['2016', '02'])).to.eql([2016, 11])
      expect(new Bitmask('yyyyxmdd').max(['2016', '03'])).to.eql([2016, 2])
    })

    it('day', () => {
      expect(new Bitmask().max(['2016', '01', '01']))
        .to.eql([2016, 0, 1])
      expect(new Bitmask('yyyymmxx').max(['2016', '01', '01']))
        .to.eql([2016, 0, 31])
      expect(new Bitmask('yyyymmxx').max(['2016', '02', '01']))
        .to.eql([2016, 1, 29])
      expect(new Bitmask('yyyymmxx').max(['2016', '04', '01']))
        .to.eql([2016, 3, 30])
    })
  })

  describe('.min()', () => {
    it('year', () => {
      expect(new Bitmask().min(['2016'])).to.eql([2016])
      expect(new Bitmask('year').min(['2016'])).to.eql([0])
      expect(new Bitmask('yxyxmmdd').min(['2016'])).to.eql([2010])
    })

    it('month', () => {
      expect(new Bitmask().min(['2019', '11'])).to.eql([2019, 10])
      expect(new Bitmask('yyyyxxdd').min(['2019', '11'])).to.eql([2019, 0])

      expect(new Bitmask('yyyymxdd').min(['2019', '09'])).to.eql([2019, 0])
      expect(new Bitmask('yyyymxdd').min(['2019', '10'])).to.eql([2019, 9])
      expect(new Bitmask('yyyymxdd').min(['2019', '11'])).to.eql([2019, 9])
      expect(new Bitmask('yyyymxdd').min(['2019', '12'])).to.eql([2019, 9])

      expect(new Bitmask('yyyyxmdd').min(['2019', '03'])).to.eql([2019, 0])
      expect(new Bitmask('yyyyxmdd').min(['2019', '12'])).to.eql([2019, 0])
    })

    it('day', () => {
      expect(new Bitmask().min(['2019', '01', '11']))
        .to.eql([2019, 0, 11])
      expect(new Bitmask('yyyymmxx').min(['2019', '01', '03']))
        .to.eql([2019, 0, 1])
      expect(new Bitmask('yyyymmxx').min(['2019', '01', '13']))
        .to.eql([2019, 0, 1])
      expect(new Bitmask('yyyymmxx').min(['2019', '01', '31']))
        .to.eql([2019, 0, 1])
      expect(new Bitmask('yyyymmdx').min(['2019', '01', '03']))
        .to.eql([2019, 0, 1])
      expect(new Bitmask('yyyymmdx').min(['2019', '01', '13']))
        .to.eql([2019, 0, 10])
      expect(new Bitmask('yyyymmdx').min(['2019', '01', '31']))
        .to.eql([2019, 0, 30])
      expect(new Bitmask('yyyymmxd').min(['2019', '01', '03']))
        .to.eql([2019, 0, 3])
      expect(new Bitmask('yyyymmxd').min(['2019', '01', '13']))
        .to.eql([2019, 0, 3])
      expect(new Bitmask('yyyymmxd').min(['2019', '01', '31']))
        .to.eql([2019, 0, 1])
      expect(new Bitmask('yyyymmxd').min(['2019', '01', '30']))
        .to.eql([2019, 0, 1])
    })
  })

  describe('.test()', () => {
    it('true', () => {
      expect(Bitmask.test(true, true)).to.be.ok
      expect(Bitmask.test(true, 'day')).to.be.ok
      expect(Bitmask.test(true, 'month')).to.be.ok
      expect(Bitmask.test(true, 'year')).to.be.ok
      expect(Bitmask.test(true, false)).to.equal(0)
    })

    it('day', () => {
      expect(Bitmask.test('day', 'day')).to.be.ok
      expect(Bitmask.test('day', 'month')).to.equal(0)
      expect(Bitmask.test('day', 'year')).to.equal(0)
      expect(Bitmask.test('day', true)).to.be.ok
    })

    it('month', () => {
      expect(Bitmask.test('month', 'month')).to.be.ok
      expect(Bitmask.test('month', 'year')).to.equal(0)
      expect(Bitmask.test('month', 'day')).to.equal(0)
      expect(Bitmask.test('month', true)).to.be.ok
      expect(Bitmask.test('month', Bitmask.Y)).to.equal(0)
      expect(Bitmask.test('month', Bitmask.YM)).to.be.ok
      expect(Bitmask.test('month', Bitmask.YMD)).to.be.ok
    })

    it('year', () => {
      expect(Bitmask.test('year', 'year')).to.be.ok
      expect(Bitmask.test('year', 'day')).to.equal(0)
      expect(Bitmask.test('year', 'month')).to.equal(0)
      expect(Bitmask.test('year', true)).to.be.ok
      expect(Bitmask.test('year', Bitmask.Y)).to.be.ok
      expect(Bitmask.test('year', Bitmask.YM)).to.be.ok
      expect(Bitmask.test('year', Bitmask.YMD)).to.be.ok
      expect(Bitmask.test('year', Bitmask.YYXX)).to.be.ok
      expect(Bitmask.test('year', Bitmask.YYYX)).to.be.ok
      expect(Bitmask.test('year', Bitmask.XXXX)).to.be.ok
    })

    it('false', () => {
      expect(Bitmask.test(false, false)).to.equal(0)
      expect(Bitmask.test(false, 'day')).to.equal(0)
      expect(Bitmask.test(false, 'month')).to.equal(0)
      expect(Bitmask.test(false, 'year')).to.equal(0)
      expect(Bitmask.test(false, true)).to.equal(0)
    })
  })

  describe('.values()', () => {
    it('XXXXXXXX', () => {
      expect(Bitmask.values('XXXXXXXX')).to.eql([0, 0, 1])
      expect(Bitmask.values('XXXXXXXX', 9)).to.eql([9999, 11, 31])
    })

    it('XXXXXXDD', () => {
      expect(Bitmask.values('XXXXXX31')).to.eql([0, 0, 31])
      expect(Bitmask.values('XXXXXX31', 9)).to.eql([9999, 11, 31])
    })

    it('XXXXMMXX', () => {
      expect(Bitmask.values('XXXX05XX')).to.eql([0, 4, 1])
      expect(Bitmask.values('XXXX05XX', 9)).to.eql([9999, 4, 31])
      expect(Bitmask.values('XXXX02XX', 9)).to.eql([9999, 1, 29])
      expect(Bitmask.values('XXXX06XX', 9)).to.eql([9999, 5, 30])
    })

    it('YYYYXXXX', () => {
      expect(Bitmask.values('2014XXXX')).to.eql([2014, 0, 1])
      expect(Bitmask.values('2014XXXX', 9)).to.eql([2014, 11, 31])
    })

    it('XXXXXXDX', () => {
      expect(Bitmask.values('XXXXXX3X')).to.eql([0, 0, 30])
      expect(Bitmask.values('XXXXXX3X', 9)).to.eql([9999, 11, 31])
      expect(Bitmask.values('XXXXXX2X')).to.eql([0, 0, 20])
      expect(Bitmask.values('XXXXXX2X', 9)).to.eql([9999, 11, 29])
    })

    it('XXXXMXXX', () => {
      expect(Bitmask.values('XXXX0XXX')).to.eql([0, 0, 1])
      expect(Bitmask.values('XXXX0XXX', 9)).to.eql([9999, 8, 30])
      expect(Bitmask.values('XXXX1XXX')).to.eql([0, 9, 1])
      expect(Bitmask.values('XXXX1XXX', 9)).to.eql([9999, 11, 31])
    })

    it('XXXXMX', () => {
      expect(Bitmask.values('XXXX0X')).to.eql([0, 0])
      expect(Bitmask.values('XXXX0X', 9)).to.eql([9999, 8])
      expect(Bitmask.values('XXXX1X')).to.eql([0, 9])
      expect(Bitmask.values('XXXX1X', 9)).to.eql([9999, 11])
    })
  })

})
