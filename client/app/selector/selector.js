/*global $, _, ko, nodeca*/


'use strict';


nodeca.once('page:loaded', function () {
  var
  embedded_fonts  = require('../../../shared/embedded_fonts'),
  glyphs_map      = require('../../../shared/glyphs_map'),
  fromCharCode    = require('../../../shared/util').fixedFromCharCode;


  function GlyphViewModel(font, data) {
    this.codeAsText = fromCharCode(glyphs_map[font.fontname][data.uid]);
  }


  function FontsViewModel(data) {
    this.id           = data.id;
    this.fontname     = data.font.fontname;

    this.author       = data.meta.author;
    this.authorText   = ko.computed(function () { return 'by ' + this.author; }, this);
    this.license      = data.meta.license;
    this.licenseText  = ko.computed(function () { return 'license - ' + this.license; }, this);
    this.homepage     = data.meta.homepage;
    this.email        = data.meta.email;
    this.emailHref    = ko.computed(function () { return 'mailto:' + this.email; }, this);
    this.twitter      = data.meta.twitter;
    this.github       = data.meta.github;

    this.glyphs       = _.map(data.glyphs, function (data) {
      return new GlyphViewModel(this, data);
    }, this);
  }


  function SelectorViewModel() {
    this.has3DEffect  = ko.observable(true);
    this.fontSize     = ko.observable(16);

    this.fonts        = _.map(embedded_fonts, function (data) {
      return new FontsViewModel(data);
    });
  }


  $(function () {
    var
    view  = $(nodeca.client.render('app.selector')).appendTo('#selector')[0],
    model = new SelectorViewModel();

    //
    // Bind model and view
    //

    ko.applyBindings(model, view);

    //
    // Bind event handlers
    //

    nodeca.on('font-size:change', function (size) {
      model.fontSize(size);
    });

    nodeca.on('3d-mode:change', function (val) {
      model.has3DEffect(val);
    });
  });
});