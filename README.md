# Browser-EDTF.js

This is a simple fork of the [EDTF.js](https://github.com/inukshuk/edtf.js) library, adapted so that it does not extend the `Date` builtin.

## Word of caution

This version of EDTF.js does not return real JavaScript `Date` objects, but objects *containing* a real date as a `privDate` property.

Therefore `edtf(new Date()) instanceof Date` will return `false`, and comparisons between 2 edtf dates will not have the same behavior.

Other than these 2 differences, all tests from the original EDTF.js (v2.7.0 as of writing) pass succesfully.

## License
AGPL-3.0
