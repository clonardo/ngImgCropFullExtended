'use strict';

crop.directive('imgCrop', ['$timeout', 'cropHost', 'cropPubSub', function ($timeout, CropHost, CropPubSub) {
    return {
        restrict: 'E',
        scope: {
            image: '=',
            resultImage: '=',
            resultArrayImage: '=?',
            resultBlob: '=?',
            urlBlob: '=?',
            chargement: '=?',
            cropject: '=?',
            maxCanvasDimensions: '=?',
            minCanvasDimensions: '=?',

            changeOnFly: '=?',
            liveView: '=?',
            initMaxArea: '=?',
            areaCoords: '=?',
            areaType: '@',
            areaMinSize: '=?',
            areaInitSize: '=?',
            areaInitCoords: '=?',
            areaInitIsRelativeToImage: '=?', /* Boolean: If true the areaInitCoords and areaInitSize is scaled according to canvas size. */
                                             /* No matter how big/small the canvas is, the resultImage remains the same */
                                             /* Example: areaInitCoords are {x: 100, y: 100}, areaInitSize {w: 100, h: 100}   */
                                             /* Image is 1000x1000
                                             /* if canvas is 500x500 Crop coordinates will be x: 50, y: 50, w: 50, h: 50 */
                                             /* if canvas is 100x100 crop coordinates will be x: 10, y: 10, w: 10, h: 10 */
            areaMinRelativeSize: '=?',
            resultImageSize: '=?',
            resultImageFormat: '=?',
            resultImageQuality: '=?',

            aspectRatio: '=?',
            allowCropResizeOnCorners: '=?',

            dominantColor: '=?',
            paletteColor: '=?',
            paletteColorLength: '=?',

            onChange: '&',
            onLoadBegin: '&',
            onLoadDone: '&',
            onLoadError: '&',
            config: '='
        },
        template: '<canvas></canvas>',
        controller: ['$scope', function ($scope) {
            $scope.events = new CropPubSub();
        }],
        link: function (scope, element) {
            
            //init watchers
            var watchers = [];
            
            //all possible params
            var applyCfg = function(){
                var params = [
                    {
                        'extName': "area-min-relative-size",
                        'localName': "areaMinRelativeSize",
                        'isOutput': false
                    },
                    {
                        'extName': "result-image-size",
                        'localName': "resultImageSize",
                        'isOutput': true
                    },
                    {
                        'extName': "result-image-format",
                        'localName': "resultImageFormat",
                        'isOutput': true
                    },
                    {
                        'extName': "result-image-quality",
                        'localName': "resultImageQuality",
                        'isOutput': true
                    },
                    {
                        'extName': "aspect-ratio",
                        'localName': "aspectRatio",
                        'isOutput': false
                    },
                    {
                        'extName': "allow-crop-resize-on-corners",
                        'localName': "allowCropResizeOnCorners",
                        'isOutput': false
                    },
                    {
                        'extName': "dominant-color",
                        'localName': "dominantColor",
                        'isOutput': true
                    },
                    {
                        'extName': "palette-color",
                        'localName': "paletteColor",
                        'isOutput': false
                    },
                    {
                        'extName': "palette-color-length",
                        'localName': "paletteColorLength",
                        'isOutput': false
                    },
                    {
                        'extName': "on-change",
                        'localName': "onChange",
                        'isOutput': false
                    },
                    {
                        'extName': "cropject",
                        'localName': "cropject",
                        'isOutput': true
                    },
                    {
                        'extName': "on-load-begin",
                        'localName': "onLoadBegin",
                        'isOutput': false
                    },
                    {
                        'extName': "on-load-done",
                        'localName': "onLoadDone",
                        'isOutput': false
                    },
                    {
                        'extName': "on-load-error",
                        'localName': "onLoadError",
                        'isOutput': false
                    },
                    {
                        'extName': "image",
                        'localName': "image",
                        'isOutput': false
                    },
                    {
                        'extName': "result-image",
                        'localName': "resultImage",
                        'isOutput': true
                    },
                    {
                        'extName': "result-array-image",
                        'localName': "resultArrayImage",
                        'isOutput': true
                    },
                    {
                        'extName': "result-blob",
                        'localName': "resultBlob",
                        'isOutput': true
                    },
                    {
                        'extName': "image",
                        'localName': "image",
                        'isOutput': false
                    },
                    {
                        'extName': "chargement",
                        'localName': "chargement",
                        'isOutput': false
                    },
                    {
                        'extName': "live-view",
                        'localName': "liveView",
                        'isOutput': true
                    },
                    {
                        'extName': "area-coords",
                        'localName': "areaCoords",
                        'isOutput': false
                    }
                ]
                
                
                //config objects rules you, sucka
                if(scope.config){
                    console.log(scope.config);
                    for(var i = 0; i< params.length; ++i){
                        var thisParamName = params[i].extName;
                        var localName = params[i].localName;
                        var isAnOutput = params[i].isOutput;
                        
                        if(scope.config.hasOwnProperty(thisParamName)){
                            console.log(thisParamName, ' ', localName);
                            
                            scope[localName] = scope.config[(thisParamName)];
                            
                            if(isAnOutput){
                                //push outputs back up
                                //var watch = scope.$watch(function(){ return scope[localName];}, function(newVal){
                                var watch = scope.$watch([localName], function(newVal){
                                    scope.$applyAsync(function(){
                                        scope.config[thisParamName] = newVal;
                                        console.log('watch outputs:',scope.config);     
                                    });
                                });
                            }
                            else{
                                //handle inputs
                                //var watch = scope.$watch(function(){ return scope.config[thisParamName];}, function(newVal){
                                var watch = scope.$watch(function(){return scope.config[thisParamName]}, function(newVal){
                                   scope.$applyAsync(function(){
                                        console.log('newVal: ',newVal);
                                        scope[localName] = newVal;
                                        console.log('watch inputs:',scope.config, scope);
                                    }); 
                                });
                            }
                            //register watcher
                            watchers.push(watch);
                        }
                    }
                }
            }
            
            
            applyCfg();
            
            if (scope.liveView && typeof scope.liveView.block == 'boolean') {
                scope.liveView.render = function (callback) {
                    updateResultImage(scope, true, callback);
                }
            } else scope.liveView = {block: false};

            // Init Events Manager
            var events = scope.events;

            // Init Crop Host
            var cropHost = new CropHost(element.find('canvas'), {}, events);

            // Store Result Image to check if it's changed
            var storedResultImage;

            var updateResultImage = function (scope, force, callback) {
                if (scope.image !== '' && (!scope.liveView.block || force)) {
                    var resultImageObj = cropHost.getResultImage();
                    if (angular.isArray(resultImageObj)) {
                        resultImage = resultImageObj[0].dataURI;
                        scope.resultArrayImage = resultImageObj;
                        console.log(scope.resultArrayImage);
                    } else var resultImage = resultImageObj.dataURI;

                    var urlCreator = window.URL || window.webkitURL;
                    if (storedResultImage !== resultImage) {
                        storedResultImage = resultImage;
                        scope.resultImage = resultImage;
                        if (scope.liveView.callback) scope.liveView.callback(resultImage);
                        if (callback) callback(resultImage);
                        cropHost.getResultImageDataBlob().then(function (blob) {
                            scope.resultBlob = blob;
                            scope.urlBlob = urlCreator.createObjectURL(blob);
                        });

                        if (scope.resultImage) {
                            cropHost.getDominantColor(scope.resultImage).then(function (dominantColor) {
                                scope.dominantColor = dominantColor;
                            });
                            cropHost.getPalette(scope.resultImage).then(function (palette) {
                                scope.paletteColor = palette;
                            });
                        }

                        updateAreaCoords(scope);
                        scope.onChange({
                            $dataURI: scope.resultImage
                        });
                    }
                }
            };

            var updateAreaCoords = function (scope) {
                var areaCoords = cropHost.getAreaCoords();
                scope.areaCoords = areaCoords;
            };

            var updateCropject = function (scope) {
                var areaCoords = cropHost.getAreaCoords();

                var dimRatio = {
                  x: cropHost.getArea().getImage().width / cropHost.getArea().getCanvasSize().w,
                  y: cropHost.getArea().getImage().height / cropHost.getArea().getCanvasSize().h
                };

                scope.cropject = {
                    areaCoords: areaCoords,
                    cropWidth: areaCoords.w,
                    cropHeight: areaCoords.h,
                    cropTop: areaCoords.y,
                    cropLeft: areaCoords.x,
                    cropImageWidth: Math.round(areaCoords.w * dimRatio.x),
                    cropImageHeight: Math.round(areaCoords.h * dimRatio.y),
                    cropImageTop: Math.round(areaCoords.y * dimRatio.y),
                    cropImageLeft: Math.round(areaCoords.x * dimRatio.x)
                };
            };

            // Wrapper to safely exec functions within $apply on a running $digest cycle
            var fnSafeApply = function (fn) {
                return function () {
                    $timeout(function () {
                        scope.$apply(function (scope) {
                            fn(scope);
                        });
                    });
                };
            };

            if (scope.chargement == null) scope.chargement = 'Chargement';
            var displayLoading = function () {
                element.append('<div class="loading"><span>' + scope.chargement + '...</span></div>')
            };

            // Setup CropHost Event Handlers
            events
                .on('load-start', fnSafeApply(function (scope) {
                    scope.onLoadBegin({});
                }))
                .on('load-done', fnSafeApply(function (scope) {
                    angular.element(element.children()[element.children().length - 1]).remove();
                    scope.onLoadDone({});
                }))
                .on('load-error', fnSafeApply(function (scope) {
                    scope.onLoadError({});
                }))
                .on('area-move area-resize', fnSafeApply(function (scope) {
                    if (!!scope.changeOnFly) {
                        updateResultImage(scope);
                    }
                    updateCropject(scope);
                }))
                .on('area-move-end area-resize-end image-updated', fnSafeApply(function (scope) {
                    updateResultImage(scope);
                    updateCropject(scope);
                }))
                .on('image-updated', fnSafeApply(function(scope) {
                    cropHost.setAreaMinRelativeSize(scope.areaMinRelativeSize);
                }));


            // Sync CropHost with Directive's options
            scope.$watch('config.image', function (newVal) {
                scope.image = scope.config.image;
                console.log('got update');
                if (newVal) {
                    displayLoading();
                }
                $timeout(function () {
                    cropHost.setInitMax(scope.initMaxArea);
                    cropHost.setNewImageSource(scope.image);
                }, 100);
            });
            scope.$watch('image', function (newVal) {
                console.log('got update');
                if (newVal) {
                    displayLoading();
                }
                $timeout(function () {
                    cropHost.setInitMax(scope.initMaxArea);
                    cropHost.setNewImageSource(scope.image);
                }, 100);
            });
            scope.$watch('areaType', function () {
                cropHost.setAreaType(scope.areaType);
                updateResultImage(scope);
            });
            scope.$watch('areaMinSize', function () {
                cropHost.setAreaMinSize(scope.areaMinSize);
                updateResultImage(scope);
            });
            scope.$watch('areaMinRelativeSize', function () {
                if (scope.image !== '') {
                    cropHost.setAreaMinRelativeSize(scope.areaMinRelativeSize);
                    updateResultImage(scope);
                }
            });
            scope.$watch('areaInitSize', function () {
                cropHost.setAreaInitSize(scope.areaInitSize);
                updateResultImage(scope);
            });
            scope.$watch('areaInitCoords', function () {
                cropHost.setAreaInitCoords(scope.areaInitCoords);
                cropHost.areaInitIsRelativeToImage = scope.areaInitIsRelativeToImage;
                updateResultImage(scope);
            });
            scope.$watch('maxCanvasDimensions', function () {
                cropHost.setMaxCanvasDimensions(scope.maxCanvasDimensions);
            });
            scope.$watch('minCanvasDimensions', function () {
                cropHost.setMinCanvasDimensions(scope.minCanvasDimensions);
            });
            scope.$watch('resultImageFormat', function () {
                cropHost.setResultImageFormat(scope.resultImageFormat);
                updateResultImage(scope);
            });
            scope.$watch('resultImageQuality', function () {
                cropHost.setResultImageQuality(scope.resultImageQuality);
                updateResultImage(scope);
            });
            scope.$watch('resultImageSize', function () {
                cropHost.setResultImageSize(scope.resultImageSize);
                updateResultImage(scope);
            });
            scope.$watch('paletteColorLength', function () {
                cropHost.setPaletteColorLength(scope.paletteColorLength);
            });
            scope.$watch('aspectRatio', function () {
                if (typeof scope.aspectRatio == 'string' && scope.aspectRatio != '') {
                    scope.aspectRatio = parseInt(scope.aspectRatio);
                }
                if (scope.aspectRatio) cropHost.setAspect(scope.aspectRatio);
            });
            scope.$watch('allowCropResizeOnCorners', function () {
                if (scope.allowCropResizeOnCorners) cropHost.setAllowCropResizeOnCorners(scope.allowCropResizeOnCorners);
            });

            // Update CropHost dimensions when the directive element is resized
            scope.$watch(
                function () {
                    return [element[0].clientWidth, element[0].clientHeight];
                },
                function (value) {
                    if(value[0] > 0 && value[1] > 0) {
                        cropHost.setMaxDimensions(value[0], value[1]);
                        updateResultImage(scope);
                    }
                },
                true
            );

            // Destroy CropHost Instance when the directive is destroying
            scope.$on('$destroy', function () {
                cropHost.destroy();
                //and clean up watchers
                watchers.forEach(item, function(){
                   item(); 
                });
            });
        }
    };
}]);
