var path = require('path');
var execa = require('execa');
var fs = require('fs');
var images = require('images');

var expect = require('chai').expect;
var rm = require('rimraf').sync;
var exec = require('child_process').execSync;

describe('command:build', function () {
  var cli = path.join(__dirname, '../../bin/easepack-build');
  var originalCwd = process.cwd();

  function setup() {
    process.chdir(path.join(__dirname, 'mock-ep-app'))
  }

  function teardown(done) {
    rm('dist');
    process.chdir(originalCwd)
    done()
  }

  describe('build an app', function () {
    var result, files;

    before(function (done) {
      setup();
      execa('node', [cli, '-o', 'dist'])
        .then(function (res) {
          result = res;
          files = fs.readdirSync('dist');
          done();
        })
        .catch(done);
    });

    after(teardown);

    it('build with expected files', function (done) {
      expect(files.length).to.equal(7);
      expect(result.code).to.equal(0);
      done();
    })

    it('build with extract css file', function (done) {
      expect(files.filter(function (file) {
        return file.endsWith('.css');
      })).to.deep.equal(['entry.css']);
      done();
    })

    it('build with minify js/css, contain username, dir', function (done) {
      var anchor = JSON.stringify(
        exec('git config --get user.name').toString().trim()).slice(1, -1);
      expect(typeof anchor).to.contain('string');
      files
        .filter(file => (file.endsWith('.js') || file.endsWith('.css')))
        .forEach(file => {
          expect(typeof file).to.equal('string');
          var content = fs.readFileSync(path.join('dist', file), 'utf8');
          expect(content.split('\n').length).to.equal(2);
          expect(content).to.contain(anchor);
          expect(content).to.contain('e2e/mock-ep-app');
          if (file.endsWith('.css')) {
            expect(content).to.contain('background:url(//cc.cdn.com/image.png)');
            expect(content).to.contain('body{display:flex;');
          }
        });
      done();
    })

    it('build with html contain correct css/js url', function (done) {
      var htmlFile = files.filter(file => (file.endsWith('.html')))[0];
      expect(typeof htmlFile).to.equal('string');
      var htmlContent = fs.readFileSync(path.join('dist', htmlFile), 'utf8');
      expect(htmlContent).to.not.contain('<!-- inject_css -->');
      expect(htmlContent).to.contain('//cc.cdn.com/image1.png');
      expect(htmlContent).to.contain('//cc.cdn.com/entry.css');
      expect(htmlContent).to.contain('//cc.cdn.com/entry.js');
      done();
    });

    it('build with sprite correct sprite minify', function (done) {
      var spriteFile = files.filter(file => (file.endsWith('image.png')))[0];
      var pngFile = files.filter(file => (file.endsWith('image1.png')))[0];
      expect(typeof spriteFile).to.equal('string');
      expect(typeof pngFile).to.equal('string');
      var spriteContent = fs.readFileSync(path.join('dist', spriteFile));
      var pngImage = images(spriteContent);
      expect(spriteContent.length < 3620).to.equal(true);
      expect(pngImage.height()).to.equal(44);
      expect(pngImage.width()).to.equal(78);
      done();
    });

    it('build with left-right sprite corrected', function (done) {
      var spriteFile = files.filter(file => (file.endsWith('leftright.png')))[0];
      expect(typeof spriteFile).to.equal('string');
      var spriteContent = fs.readFileSync(path.join('dist', spriteFile));
      var pngImage = images(spriteContent);
      expect(pngImage.height()).to.equal(129);
      expect(pngImage.width()).to.equal(816);
      done();
    });

    it('build with images using base64', function (done) {
      var file = files.filter(file => (file.endsWith('.css')))[0];
      var content = fs.readFileSync(path.join('dist', file), 'utf8');
      expect(content).to.contain('data:image/jpeg;base64');
      expect(content).to.contain('data:image/png;base64');
      expect(typeof file).to.equal('string');
      done();
    });

  });
});