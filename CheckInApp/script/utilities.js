var UtilitiesModule = (function() {
  'use strict';

  var canvasContainerHeight = 0.6,
      canvasContainerWidth = 0.8,
      canvasSize = 0.8;

  function getDocHeight() {
    var doc = document;
    return Math.max(
      doc.body.scrollHeight, doc.documentElement.scrollHeight,
      doc.body.offsetHeight, doc.documentElement.offsetHeight,
      doc.body.clientHeight, doc.documentElement.clientHeight
    );
  }

  function getDocWidth() {
    var doc = document;
    return Math.max(
      doc.body.scrollWidth, doc.documentElement.scrollWidth,
      doc.body.offsetWidth, doc.documentElement.offsetWidth,
      doc.body.clientWidth, doc.documentElement.clientWidth
    );
  }

  function getNewCanvas() {
    var canvas = document.createElement('canvas');
    canvas.style.width = Math.floor(getDocWidth() * canvasContainerWidth * canvasSize) + 'px';
    canvas.style.height = Math.floor(getDocHeight() * canvasContainerHeight * canvasSize) + 'px';
    canvas.id = 'chart';

    return canvas;
  }

  return {
    getNewCanvas: getNewCanvas
  };

}());


