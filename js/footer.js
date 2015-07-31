//= require vendor/fontfaceobserver
//= require vendor/fastclick
//= require vendor/aws-sdk

(function(FontFaceObserver, AWS) {
  'use strict';

  // Enable fastclick.
  FastClick.attach(document.body);

  var fontPromises = [];
  var pt = new FontFaceObserver('pt');
  var italic = new FontFaceObserver('pt', {style: 'italic'});

  fontPromises.push(pt.check(null, 5000));
  fontPromises.push(italic.check(null, 5000));

  Promise.all(fontPromises).then(function() {
    // If all promises are fulfilled, then add the proper class to signify.
    document.documentElement.className += ' fonts-loaded';
    document.cookie = 'iF=true';
  }, function() {
    // A font did not load, create a class so that we know that we have
    // failed as loaders of fonts.
    document.documentElement.className += ' fonts-unavailable';
    document.cookie = 'iF=false';
  });

  AWS.config.update({accessKeyId: 'AKIAISIPFI73OOXKZP7A', secretAccessKey: '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'});
  AWS.config.region = 'us-east-1';

  var bucket = new AWS.S3({params: {Bucket: 'ia.ncarri.co', Prefix: 'g/'}});
  bucket.listObjects(function (err, data) {
    if (err) {
      console.log(err);
      var div = document.createElement('div');
      div.setAttribute('class', 'error');
      div.innerHTML = err;

      document.getElementById('home').appendChild(div);
    } else {
      for (var i = 1; i < data.Contents.length; i++) {
        var img = document.createElement('img');
        img.src = 'http://ia.ncarri.co/' + data.Contents[i].Key;
        img.setAttribute('class', 's3-image');
        document.getElementById('home').appendChild(img);
      }
    }
  });
})(FontFaceObserver, AWS);
