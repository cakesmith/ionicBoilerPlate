'use strict';

describe('Tectonic.config', function () {

  beforeEach(module('Tectonic.config'));

  it('should have FBURL beginning with https', inject(function(FBURL) {

    expect(FBURL).toMatch(/^https:\/\/[a-zA-Z_-]+\.firebaseio\.com/i);

  }));

  it('should have a valid SEMVER version', inject(function(version) {
    expect(version).toMatch(/^\d\d*(\.\d+)+$/);
  }));




});