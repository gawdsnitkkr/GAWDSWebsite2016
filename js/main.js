(function (w, d, $) {
    var WindowObject = $(w),
        DocumentObject = $(d),
        Width = w.innerWidth,
        Height = w.innerHeight,
        HalfWidth = Width / 2,
        HalfHeight = Height / 2,
        ScrollObject,
        StartPageObject,
        EnvelopeObject,
        EnvelopeStates = {
            Opened: 1,
            Closed: 2,
            Opening: 3,
            Closing: 4
        },
        WhoWeAreObject,
        NavigationHelperObject,
        ScrollDownHelperObject,
        FacebookLinkObject,
        LinkedInLinkObject,
        MemberObjects;

    function IsChrome() {
        var flag = w.chrome,
            name = w.navigator.vendor,
            operaFlag = w.navigator.userAgent.indexOf("OPR") > -1;
        return (flag !== null && flag !== undefined && name === "Google Inc." && operaFlag == false);
    }

    $.fn.StartPage = function (o) {
        var Element = this,
            SVG = $('#StartPageSVG', Element),
            SVGDoc,
            SVGDocObject,
            SVGRoot,
            SVGRootObject,
            DotLayer,
            Dot,
            DotBlip,
            LineBottom,
            LineTop,
            WeLayer,
            WeLayerElements,
            WeLayerElementsCount,
            CreateLayer,
            CreateLayerElements,
            CreateLayerElementsCount,
            DesignLayer,
            DesignLayerElements,
            DesignLayerElementsCount,
            PHPLayer,
            PHPLayerElements,
            PHPLayerElementsCount,
            HTMLLayer,
            HTMLLayerElements,
            HTMLLayerElementsCount,
            DevelopLayer,
            DevelopLayerElements,
            DevelopLayerElementsCount,
            CursorLayer,
            CursorGroup,
            Cursor,
            DotsLayer,
            TextLayer,
            GAWDS,
            Dots = [],
            NumberOfDots = 40,
            StopGAWDSFlag = false,
            GAWDSStarted = false,
            random = Math.random,
            Options = $.extend({
                Width: 854,
                Height: 480,
                HalfWidth: 427,
                HalfHeight: 240,
                DotsRegionWidth: 854,
                DotsRegionHeight: 400,
                DotScale: 0.25,
                DotUpScale: 0.5,
                DotBlipInScale: 2.5,
                DotBlipOutScale: 5,
                CallBack: undefined,
                Speed: 1.5
            }, o);
        var Functions = {
            Blip: function (Count, Callback) {
                var DotScale = Options.DotScale,
                    DotUpScale = Options.DotUpScale,
                    DotBlipInScale = Options.DotBlipInScale,
                    DotBlipOutScale = Options.DotBlipOutScale,
                    Speed = Options.Speed;
                TweenMax.fromTo(Dot, 0.35 / Speed, {
                    scale: DotScale,
                    transformOrigin: '50% 50%'
                }, {
                    scale: DotUpScale,
                    transformOrigin: '50% 50%',
                    ease: Power4.easeOut,
                    onComplete: function () {
                        TweenMax.fromTo(Dot, 0.35 / Speed, {
                            scale: DotUpScale,
                            transformOrigin: '50% 50%'
                        }, {
                            scale: DotScale,
                            transformOrigin: '50% 50%',
                            ease: Power4.easeOut
                        });
                    }
                });
                TweenMax.fromTo(DotBlip, 0.35 / Speed, {
                    opacity: 0,
                    scale: 0
                }, {
                    opacity: 1,
                    scale: DotBlipInScale,
                    transformOrigin: '50% 50%',
                    ease: Linear.easeOut,
                    onComplete: function () {
                        TweenMax.fromTo(DotBlip, 0.35 / Speed, {
                            opacity: 1,
                            scale: DotBlipInScale,
                            transformOrigin: '50% 50%'
                        }, {
                            opacity: 0,
                            scale: DotBlipOutScale,
                            transformOrigin: '50% 50%',
                            ease: Power4.easeOut,
                            onComplete: Count < 1 ? function () {
                                Count++;
                                Functions.Blip(Count, Callback);
                            } : Callback
                        });
                    }
                });
            },
            ElementsAnimation: function (Elements, ElementsCount, Time, Delay, ElementDelay, From, To, Invert, CallBack) {
                Invert = Invert || 0;
                var Index = 0,
                    Limit = ElementsCount - 1;
                if (Invert) {
                    Index = Limit;
                    for (; Index >= 0; Index--) {
                        TweenMax.fromTo(Elements[Index], Time, From, $.extend(To, {
                            delay: ElementDelay * Index + Delay,
                            onComplete: function () {
                                if (parseInt($(this.target).attr('count')) == 0) {
                                    if (CallBack != undefined) CallBack();
                                }
                            }
                        }));
                    }
                } else {
                    for (; Index < ElementsCount; Index++) {
                        TweenMax.fromTo(Elements[Index], Time, From, $.extend(To, {
                            delay: ElementDelay * Index + Delay,
                            onComplete: function () {
                                if (parseInt($(this.target).attr('count')) == Limit) {
                                    if (CallBack != undefined) CallBack();
                                }
                            }
                        }));
                    }
                }
                return Functions;
            },
            CursorAnimation: function (Count, Total, Duration, Delay) {
                Count = Count || 0;
                TweenMax.fromTo(CursorGroup, Duration, {
                    fillOpacity: 1,
                    x: Count * 51
                }, {
                    x: (Count + 1) * 51,
                    delay: Delay,
                    onComplete: Count < Total ? function () {
                        Functions.CursorAnimation(++Count, Total, Duration, Delay);
                    } : undefined
                });
            },
            CursorBlipAnimation: function (Duration, CallBack) {
                Duration = Duration || 0.5 / Options.Speed;
                TweenMax.fromTo(CursorGroup, Duration, {
                    fillOpacity: 1,
                    scale: 1,
                    transformOrigin: '50% 50%'
                }, {
                    fillOpacity: 0.2,
                    scale: 0.8,
                    transformOrigin: '50% 50%',
                    onComplete: function () {
                        TweenMax.fromTo(CursorGroup, Duration, {
                            fillOpacity: 0.2,
                            scale: 0.8,
                            transformOrigin: '50% 50%'
                        }, {
                            fillOpacity: 1,
                            scale: 1,
                            transformOrigin: '50% 50%',
                            onComplete: function () {
                                TweenMax.fromTo(CursorGroup, Duration, {
                                    fillOpacity: 1
                                }, {
                                    fillOpacity: 0,
                                    onComplete: CallBack
                                });
                            }
                        });
                    }
                });
            },
            Start: function () {
                var DotScale = Options.DotScale,
                    Speed = Options.Speed;
                TweenMax.fromTo(Dot, 1 / Speed, {
                    fillOpacity: 0,
                    scale: 0
                }, {
                    fillOpacity: 1,
                    scale: DotScale,
                    transformOrigin: '50% 50%',
                    delay: 0.25,
                    ease: Elastic.easeOut,
                    onComplete: function () {
                        Functions.Blip(0, function () {
                            TweenMax.fromTo(Dot, 1 / Speed, {
                                fillOpacity: 1,
                                scale: DotScale,
                                transformOrigin: '50% 50%'
                            }, {
                                fillOpacity: 0,
                                scale: 0,
                                transformOrigin: '50% 50%',
                                ease: Elastic.easeOut.config(10, 10)
                            });
                            TweenMax.to(LineBottom, 1 / Speed, {
                                fillOpacity: 1,
                                attr: {
                                    width: 564,
                                    x: 150
                                },
                                ease: Elastic.easeOut.config(10, 10),
                                onComplete: function () {
                                    TweenMax.to(LineBottom, 1 / Speed, {
                                        attr: {
                                            y: 256
                                        },
                                        ease: Elastic.easeOut.config(10, 10)
                                    });
                                    TweenMax.fromTo(LineTop, 1 / Speed, {
                                        fillOpacity: 1,
                                        attr: {
                                            width: 564,
                                            y: 227
                                        }
                                    }, {
                                        attr: {
                                            y: 196
                                        },
                                        ease: Elastic.easeOut.config(10, 10)
                                    });
                                    TweenMax.to(WeLayer, 1 / Speed, {
                                        opacity: 1,
                                        ease: Power4.easeOut,
                                        delay: 0.1
                                    });
                                    Functions.ElementsAnimation(CreateLayerElements, CreateLayerElementsCount, 1 / Speed, 0, 0.1 / Speed, {
                                        x: -10,
                                        rotationX: -90,
                                        transformOrigin: '50% 50%'
                                    }, {
                                        x: 10,
                                        rotationX: 0,
                                        fillOpacity: 1,
                                        transformOrigin: '50% 50%',
                                        ease: Elastic.easeOut
                                    }, 0, function () {
                                        Functions.ElementsAnimation(CreateLayerElements, CreateLayerElementsCount, 0.75 / Speed, 0, 0.1 / Speed, {
                                            rotationX: 0,
                                            transformOrigin: '50% 50%'
                                        }, {
                                            rotationX: 360,
                                            fillOpacity: 0,
                                            transformOrigin: '50% 50%',
                                            ease: Bounce.easeOut
                                        }, 0);
                                        Functions.ElementsAnimation(DesignLayerElements, DesignLayerElementsCount, 0.75 / Speed, 0, 0.1 / Speed, {
                                            scale: 1,
                                            rotationX: 360,
                                            fillOpacity: 0,
                                            transformOrigin: '50% 50%'
                                        }, {
                                            rotationX: 0,
                                            fillOpacity: 1,
                                            transformOrigin: '50% 50%',
                                            ease: Bounce.easeOut
                                        }, 0, function () {
                                            Functions.ElementsAnimation(DesignLayerElements, DesignLayerElementsCount, 0.75 / Speed, 0, 0.1 / Speed, {
                                                scale: 1,
                                                fillOpacity: 1,
                                                transformOrigin: '50% 50%'
                                            }, {
                                                scale: 1.5,
                                                fillOpacity: 0,
                                                transformOrigin: '50% 50%',
                                                ease: Elastic.easeOut.config(10, 10)
                                            }, 0);
                                            TweenMax.fromTo(CursorGroup, 0.1 / Speed, {
                                                fillOpacity: 0
                                            }, {
                                                fillOpacity: 1,
                                                delay: 0.1,
                                                onComplete: function () {
                                                    Functions.CursorBlipAnimation(0.1 / Speed, function () {
                                                        Functions.CursorAnimation(0, 7, 0.1 / Speed, 0);
                                                        Functions.ElementsAnimation(PHPLayerElements, PHPLayerElementsCount, 0.1 / Speed, 0, 0.15 / Speed, {
                                                            fillOpacity: 0,
                                                            scale: 0.8,
                                                            transformOrigin: '50% 50%',
                                                            x: -5
                                                        }, {
                                                            fillOpacity: 1,
                                                            scale: 1,
                                                            transformOrigin: '50% 50%',
                                                            x: 0,
                                                            ease: Linear.easeNone
                                                        }, 0, function () {
                                                            Functions.CursorBlipAnimation(0.1 / Speed, function () {
                                                                Functions.ElementsAnimation(PHPLayerElements, PHPLayerElementsCount, 0.1 / Speed, 0, 0.15 / Speed, {
                                                                    fillOpacity: 1,
                                                                    scale: 1,
                                                                    transformOrigin: '50% 50%',
                                                                    x: 0
                                                                }, {
                                                                    fillOpacity: 0,
                                                                    scale: 0.8,
                                                                    transformOrigin: '50% 50%',
                                                                    x: 5,
                                                                    ease: Linear.easeNone
                                                                }, 1, function () {
                                                                    Functions.CursorAnimation(0, 7, 0.1 / Speed, 0);
                                                                    Functions.ElementsAnimation(HTMLLayerElements, HTMLLayerElementsCount, 0.1 / Speed, 0, 0.15 / Speed, {
                                                                        fillOpacity: 0,
                                                                        scale: 0.8,
                                                                        transformOrigin: '50% 50%',
                                                                        x: -5
                                                                    }, {
                                                                        fillOpacity: 1,
                                                                        scale: 1,
                                                                        transformOrigin: '50% 50%',
                                                                        x: 0,
                                                                        ease: Linear.easeNone
                                                                    }, 0, function () {
                                                                        Functions.CursorBlipAnimation(0.1 / Speed, function () {
                                                                            Functions.ElementsAnimation(HTMLLayerElements, HTMLLayerElementsCount, 0.1 / Speed, 0, 0.15 / Speed, {
                                                                                fillOpacity: 1,
                                                                                scale: 1,
                                                                                transformOrigin: '50% 50%',
                                                                                x: 0
                                                                            }, {
                                                                                fillOpacity: 0,
                                                                                scale: 0.8,
                                                                                transformOrigin: '50% 50%',
                                                                                x: 5,
                                                                                ease: Linear.easeNone
                                                                            }, 1, function () {
                                                                                Functions.CursorAnimation(0, 7, 0.1 / Speed, 0);
                                                                                Functions.ElementsAnimation(DevelopLayerElements, DevelopLayerElementsCount, 0.1 / Speed, 0, 0.15 / Speed, {
                                                                                    fillOpacity: 0,
                                                                                    scale: 0.8,
                                                                                    transformOrigin: '50% 50%',
                                                                                    x: -5
                                                                                }, {
                                                                                    fillOpacity: 1,
                                                                                    scale: 1,
                                                                                    transformOrigin: '50% 50%',
                                                                                    x: 0,
                                                                                    ease: Linear.easeNone
                                                                                }, 0, function () {
                                                                                    Functions.CursorBlipAnimation(0.1 / Speed, Functions.Close);
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                }
                                            });
                                        });
                                    });
                                }
                            });
                        });
                    }
                });
                return Functions;
            },
            Close: function () {
                var Speed = Options.Speed;
                setTimeout(function () {
                    TweenMax.to(DevelopLayer, 0.75 / Speed, {
                        opacity: 0,
                        scale: 0.8,
                        transformOrigin: '50% 50%',
                        ease: Elastic.easeOut.config(10, 10),
                        onComplete: function () {
                            DevelopLayer.css('opacity', 1);
                            DevelopLayerElements.css('fill-opacity', 0);
                        }
                    });
                    TweenMax.to(WeLayer, 0.75 / Speed, {
                        opacity: 0,
                        scale: 0.8,
                        transformOrigin: '50% 50%',
                        ease: Elastic.easeOut.config(10, 10)
                    });
                    TweenMax.to(LineBottom, 0.75 / Speed, {
                        attr: {
                            y: 227
                        },
                        delay: 0.25,
                        ease: Elastic.easeOut.config(10, 10)
                    });
                    TweenMax.to(LineTop, 0.75 / Speed, {
                        attr: {
                            y: 227
                        },
                        delay: 0.25,
                        ease: Elastic.easeOut.config(10, 10),
                        onComplete: function () {
                            LineTop.css('fill-opacity', 0);
                            TweenMax.to(LineBottom, 0.5 / Speed, {
                                fillOpacity: 0,
                                attr: {
                                    width: 10,
                                    x: 410
                                },
                                ease: Power4.easeOut
                            });
                            TweenMax.fromTo(Dot, 1 / Speed, {
                                scale: Options.DotUpScale,
                                transformOrigin: '50% 50%'
                            }, {
                                fillOpacity: 1,
                                fill: '#00BEBE',
                                scale: Options.DotScale,
                                transformOrigin: '50% 50%',
                                ease: Elastic.easeOut
                            });
                            TweenMax.fromTo(DotBlip, 0.35 / Speed, {
                                opacity: 0,
                                scale: 0
                            }, {
                                opacity: 1,
                                scale: Options.DotBlipInScale,
                                transformOrigin: '50% 50%',
                                ease: Linear.easeOut,
                                delay: 0.15 / Speed,
                                onComplete: function () {
                                    TweenMax.fromTo(DotBlip, 0.35 / Speed, {
                                        opacity: 1,
                                        scale: Options.DotBlipInScale
                                    }, {
                                        opacity: 0,
                                        scale: Options.DotBlipOutScale,
                                        transformOrigin: '50% 50%',
                                        ease: Power4.easeOut,
                                        onComplete: Functions.StartGAWDS
                                    });
                                }
                            });
                        }
                    });
                }, 500 / Speed);
            },
            CreateDots: function () {
                var i = 0,
                    Dot,
                    DotScale = Options.DotScale;
                for (; i < NumberOfDots; i++) {
                    Dot = d.createElementNS('http://www.w3.org/2000/svg', 'path');
                    Dot.setAttribute('d', 'm439 240a12 12 0 0 1-12 12 12 12 0 0 1-12-12 12 12 0 0 1 12-12 12 12 0 0 1 12 12z');
                    Dot.style.fill = '#ccc';
                    Dot.style.filter = 'url(#Color)';
                    Dot.style.stroke = 'none';
                    Dot.style.fillOpacity = 0;
                    Dots.push($(Dot).appendTo(DotsLayer));
                    TweenMax.set(Dots[i], {
                        scale: DotScale,
                        x: -3,
                        y: -3
                    });
                }
            },
            DotAnimation: function (Element) {
                var Random = random();
                TweenMax.to(Element, 1, {
                    fillOpacity: Random * 0.4 + 0.04,
                    ease: Power4.easeOut,
                    delay: Random,
                    onComplete: StopGAWDSFlag ? undefined : function () {
                        Functions.DotAnimation(Element);
                    }
                });
            },
            GAWDSAnimation: function () {
                TweenMax.to(GAWDS, 20, {
                    scale: 1.75,
                    transformOrigin: '50% 50%',
                    ease: Linear.easeNone,
                    onComplete: function () {
                        TweenMax.to(GAWDS, 10, {
                            scale: 1.25,
                            transformOrigin: '50% 50%',
                            ease: Linear.easeNone,
                            onComplete: StopGAWDSFlag ? undefined : Functions.GAWDSAnimation
                        });
                    }
                });
            },
            StartGAWDS: function () {
                Functions.CreateDots();
                var i = 0,
                    X,
                    Y,
                    CurrentDot;
                for (; i < NumberOfDots; i++) {
                    CurrentDot = Dots[i];
                    X = (random() - 0.5) * Options.DotsRegionWidth;
                    Y = (random() - 0.5) * Options.DotsRegionHeight;
                    TweenMax.to(CurrentDot, 0.1, {
                        transformOrigin: '50% 50%',
                        scale: random() * 5 + 1,
                        x: X,
                        y: Y,
                        fillOpacity: random() * 0.4 + 0.04,
                        ease: Power4.easeOut,
                        delay: 0.05 * i
                    });
                }
                TweenMax.to(Dot, 0.05 * NumberOfDots, {
                    transformOrigin: '50% 50%',
                    scale: 6,
                    ease: Linear.easeOut,
                    onComplete: function () {
                        TweenMax.to(Dot, 1, {
                            transformOrigin: '50% 50%',
                            scale: Options.Width / 12,
                            ease: Power4.easeOut
                        });
                        TweenMax.to(Dot, 1.5, {
                            fillOpacity: 0,
                            delay: 0.5,
                            ease: Power4.easeOut
                        });
                        TweenMax.to(GAWDS, 1.5, {
                            fillOpacity: 1,
                            scale: 1.25,
                            transformOrigin: '50% 50%',
                            ease: Power4.easeOut,
                            delay: 0.5,
                            onComplete: function () {
                                GAWDSStarted = true;
                                Functions.GAWDSAnimation();
                                Options.CallBack();
                            }
                        });
                        i = 0;
                        for (; i < NumberOfDots; i++) {
                            Functions.DotAnimation(Dots[i], 1);
                        }
                    }
                });
            },
            Pause: function () {
                if (GAWDSStarted) {
                    StopGAWDSFlag = true;
                }
            },
            Play: function () {
                if (StopGAWDSFlag && GAWDSStarted) {
                    StopGAWDSFlag = false;
                    Functions.GAWDSAnimation();
                    var i = 0;
                    for (; i < NumberOfDots; i++) {
                        Functions.DotAnimation(Dots[i], 1);
                    }
                }
            },
            Resize: function (Width, Height) {
                Width = Width || Options.Width;
                Height = Height || Options.Height;
                Element.css({
                    width: Width,
                    height: Height
                });
                SVG.attr({
                    width: Width,
                    height: Height
                });
                return Functions;
            }
        };
        SVG.on('load', function () {
            SVGDoc = SVG[0].contentDocument;
            SVGDocObject = $(SVGDoc);
            SVGRoot = SVGDoc.documentElement;
            SVGRootObject = $(SVGRoot);
            DotLayer = $('#DotLayer', SVGRoot);
            Dot = $('#Dot', DotLayer);
            DotBlip = $('#DotBlip', DotLayer);
            LineBottom = $('#LineBottom', DotLayer);
            LineTop = $('#LineTop', DotLayer);
            WeLayer = $('#WeLayer', SVGRoot);
            WeLayerElements = WeLayer.find('g');
            WeLayerElementsCount = WeLayerElements.length;
            CreateLayer = $('#CreateLayer', SVGRoot);
            CreateLayerElements = CreateLayer.find('g');
            CreateLayerElementsCount = CreateLayerElements.length;
            DesignLayer = $('#DesignLayer', SVGRoot);
            DesignLayerElements = DesignLayer.find('g');
            DesignLayerElementsCount = DesignLayerElements.length;
            PHPLayer = $('#PHPLayer', SVGRoot);
            PHPLayerElements = PHPLayer.find('g');
            PHPLayerElementsCount = PHPLayerElements.length;
            HTMLLayer = $('#HTMLLayer', SVGRoot);
            HTMLLayerElements = HTMLLayer.find('g');
            HTMLLayerElementsCount = HTMLLayerElements.length;
            DevelopLayer = $('#DevelopLayer', SVGRoot);
            DevelopLayerElements = DevelopLayer.find('g');
            DevelopLayerElementsCount = DevelopLayerElements.length;
            CursorLayer = $('#CursorLayer', SVGRoot);
            CursorGroup = $('#CursorGroup', SVGRoot);
            Cursor = $('#Cursor', CursorGroup);
            DotsLayer = $('#DotsLayer', DotLayer);
            TextLayer = $('#TextLayer', SVGRoot);
            GAWDS = $('#GAWDS', TextLayer);
            Functions.Resize().Start();
        });
        return Functions;
    };
    $.fn.Envelope = function (o) {
        var Element = this,
            EnvelopeBack = $('#EnvelopeBackSVG', Element),
            EnvelopeFront = $('#EnvelopeFrontSVG', Element),
            EnvelopeBackDoc,
            EnvelopeBackRoot,
            EnvelopeFrontDoc,
            EnvelopeFrontDocObject,
            EnvelopeFrontRoot,
            BackLayer,
            Back,
            BackCoverLayer,
            BackCover,
            FrontCoverLayer,
            FrontCover,
            FrontLayer,
            Front,
            PageLayer,
            Page,
            SubmitLayer,
            SubmitTop,
            SubmitBottom,
            ShadowPolygon,
            ShadowPoints = {
                x1: 540,
                y1: 111,
                x2: 600,
                y2: 140,
                x3: 800,
                y3: 240,
                x4: 800,
                y4: 620,
                x5: 540,
                y5: 620
            },
            State = EnvelopeStates.Closed,
            Form = $('#Form', Element),
            Name = $('#Name', Form),
            NameTag = $('#NameTag', Form),
            Email = $('#Email', Form),
            EmailTag = $('#EmailTag', Form),
            Message = $('#Message', Form),
            MessageTag = $('#MessageTag', Form),
            MessageCount = $('#MessageCount', MessageTag),
            Loading = $('#Loading', Element),
            Done = $('#Done', Element),
            Fail = $('#Fail', Element),
            ErrorMessage = $('#ErrorMessage', Element),
            Posted = false,
            Options = $.extend({
                FrameHalfWidth: 300,
                Width: 800,
                Height: 500,
                HalfWidth: 400,
                HalfHeight: 250,
                FormAction: 'post.php',
                FormMethod: 'POST'
            }, o);
        Element.css({
            width: 600,
            height: 500
        });
        var Functions = {
            ValidateName: function () {
                return Name.val() === '';
            },
            ValidateEmail: function () {
                return !(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(Email.val()));
            },
            ValidateMessage: function () {
                return Message.val() === '';
            },
            ValidateForm: function () {
                var Error = false;
                Error = Error || Functions.ValidateName();
                Error = Error || Functions.ValidateEmail();
                Error = Error || Functions.ValidateMessage();
                return !Error;
            },
            ValidationResponse: function (Element, Flag) {
                if (Flag) {
                    TweenMax.to(Element, 0.5, {
                        borderColor: '#cc3333',
                        ease: Power4.easeOut
                    });
                } else {
                    TweenMax.to(Element, 0.5, {
                        borderColor: '#333333'
                    });
                }
            },
            TextBind: function (Element, ElementTag, ValidateFunction) {
                Element.on('focus', function () {
                    TweenMax.to(ElementTag, 0.5, {
                        scale: 0.7,
                        top: 15,
                        transformOrigin: '0% 0%',
                        ease: Power4.easeOut
                    });
                    TweenMax.to(Element, 0.5, {
                        opacity: 1,
                        ease: Power4.easeOut
                    });
                });
                Element.on('blur', function () {
                    if (Element.val() == '') {
                        TweenMax.to(ElementTag, 0.5, {
                            scale: 1,
                            top: 29,
                            transformOrigin: '0% 0%',
                            ease: Power4.easeOut
                        });
                    }
                    TweenMax.to(Element, 0.5, {
                        opacity: 0.8,
                        ease: Power4.easeOut
                    });
                });
                Element.on('keyup', function () {
                    Functions.ValidationResponse(Element, ValidateFunction());
                });
                Element.on('keydown', function () {
                    Functions.ValidationResponse(Element, ValidateFunction());
                });
            },
            TextAreaBind: function (Element, ElementTag, ElementCount) {
                var Max = parseInt(Element.attr('maxlength'));
                ElementCount.text('(' + Max + ')');
                Element.on('focus', function () {
                    TweenMax.to(ElementCount, 0.5, {
                        opacity: 1,
                        ease: Power4.easeOut
                    });
                });
                Element.on('blur', function () {
                    TweenMax.to(ElementCount, 0.5, {
                        opacity: 0,
                        ease: Power4.easeOut
                    });
                });
                Element.on('keydown', function () {
                    ElementCount.text('(' + (Max - Element.val().length) + ')');
                });
                Element.on('keyup', function () {
                    ElementCount.text('(' + (Max - Element.val().length) + ')');
                });
            },
            RePosition: function (Width, Height, HalfWidth) {
                Width = Width || w.innerWidth;
                Height = Height || w.innerHeight;
                HalfWidth = HalfWidth || Width / 2;
                Element.css({
                    top: Height - Options.Height,
                    left: HalfWidth - Options.FrameHalfWidth
                });
                return Functions;
            },
            ApplyShadow: function () {
                ShadowPolygon.attr('points', [ShadowPoints.x1, ',', ShadowPoints.y1, ' ',
                    ShadowPoints.x2, ',', ShadowPoints.y2, ' ',
                    ShadowPoints.x3, ',', ShadowPoints.y3, ' ',
                    ShadowPoints.x4, ',', ShadowPoints.y4, ' ',
                    ShadowPoints.x5, ',', ShadowPoints.y5].join(''));
                return Functions;
            },
            Loading: function (Count) {
                Count = Count || 2;
                TweenMax.to(Loading, 0.5, {
                    opacity: 0.9,
                    scale: 0.9,
                    transformOrigin: '50% 50%',
                    ease: Elastic.easeOut.config(10, 5),
                    onComplete: function () {
                        TweenMax.to(Loading, 0.5, {
                            opacity: 1,
                            scale: 1,
                            transformOrigin: '50% 50%',
                            ease: Elastic.easeOut.config(10, 5),
                            onComplete: function () {
                                Loading.html('Posting' + Array(Count).join("."));
                                if (Count > 3) Count = 2;
                                else Count++;
                                if (!Posted) {
                                    Functions.Loading(Count);
                                }
                            }
                        });
                    }
                });
            },
            SendMessage: function () {
                var Top = IsChrome() ? 180 : -40;
                $.ajax({
                    method: Options.FormMethod,
                    url: Options.FormAction,
                    data: {
                        FullName: Name.val(),
                        Email: Email.val(),
                        Message: Message.val()
                    },
                    beforeSend: function () {
                        Posted = false;
                        TweenMax.to(Loading, 0.5, {
                            opacity: 1,
                            top: Top,
                            ease: Power4.easeOut,
                            onComplete: Functions.Loading
                        });
                    }
                }).done(function () {
                    Posted = true;
                    TweenMax.to(Loading, 0.5, {
                        opacity: 0,
                        top: Top,
                        ease: Power4.easeOut,
                        onComplete: function () {
                            Loading.css({
                                display: 'none',
                                top: '200px'
                            });
                        }
                    });
                    TweenMax.fromTo(Done, 0.5, {
                        display: 'block'
                    }, {
                        opacity: 1,
                        top: Top + 10,
                        ease: Power4.easeOut,
                        onComplete: function () {
                            TweenMax.to(Done, 0.5, {
                                opacity: 0,
                                top: Top,
                                delay: 0.5,
                                ease: Power4.easeOut,
                                onComplete: function () {
                                    Done.css({
                                        display: 'none',
                                        top: (Top + 20) + 'px'
                                    });
                                    Functions.Open();
                                }
                            });
                        }
                    });
                }).fail(function () {
                    Posted = true;
                    TweenMax.to(Loading, 0.5, {
                        opacity: 0,
                        top: Top,
                        ease: Power4.easeOut,
                        onComplete: function () {
                            Loading.css({
                                display: 'none',
                                top: (Top + 20) + 'px'
                            });
                        }
                    });
                    TweenMax.fromTo(Fail, 0.5, {
                        display: 'block'
                    }, {
                        opacity: 1,
                        top: Top + 10,
                        ease: Power4.easeOut,
                        onComplete: function () {
                            TweenMax.to(Fail, 0.5, {
                                opacity: 0,
                                top: Top,
                                delay: 0.5,
                                ease: Power4.easeOut,
                                onComplete: function () {
                                    Fail.css({
                                        display: 'none',
                                        top: (Top + 20) + 'px'
                                    });
                                    Functions.Open();
                                }
                            });
                        }
                    });
                });
            },
            Open: function () {
                if (State == EnvelopeStates.Closed) {
                    State = EnvelopeStates.Opening;
                    Functions.UnBind();
                    Name.val('');
                    TweenMax.to(NameTag, 0.5, {
                        scale: 1,
                        top: 29,
                        transformOrigin: '0% 0%',
                        ease: Power4.easeOut
                    });
                    Email.val('');
                    TweenMax.to(EmailTag, 0.5, {
                        scale: 1,
                        top: 29,
                        transformOrigin: '0% 0%',
                        ease: Power4.easeOut
                    });
                    Message.val('').css('height', '38px');
                    TweenMax.to(MessageTag, 0.5, {
                        scale: 1,
                        top: 29,
                        transformOrigin: '0% 0%',
                        ease: Power4.easeOut
                    });
                    TweenMax.to(Element, 1, {
                        opacity: 1,
                        y: 0,
                        ease: Power4.easeOut
                    });
                    if (IsChrome()) {
                        TweenMax.to(FrontCover, 0.5, {
                            rotationX: 90,
                            transformOrigin: '50% 100%',
                            delay: 0.1,
                            fill: '#cccccc',
                            ease: Linear.easeNone,
                            onComplete: function () {
                                TweenMax.set(FrontCover, {
                                    fill: '#999999',
                                    opacity: 0
                                });
                                TweenMax.fromTo(BackCover, 0.5, {
                                    fill: '#888888'
                                }, {
                                    fill: '#999999',
                                    rotationX: 0,
                                    transformOrigin: '50% 100%',
                                    ease: Linear.easeNone
                                });
                            }
                        });
                    }
                    TweenMax.to(SubmitLayer, 0.5, {
                        opacity: 1,
                        y: 0,
                        delay: 0.25,
                        ease: Power4.easeOut
                    });
                    TweenMax.to(Page, 1, {
                        attr: {
                            y: 111
                        },
                        delay: 0.75,
                        ease: Power4.easeOut,
                        onComplete: function () {
                            State = EnvelopeStates.Opened;
                            Functions.Bind();
                        },
                        onUpdate: function () {
                            ShadowPoints.y1 = parseInt($(this.target).attr('y'));
                            ShadowPoints.y2 = ShadowPoints.y1 < 185 ? ShadowPoints.y1 + 30 : 215;
                            ShadowPoints.y3 = ShadowPoints.y2 + 100;
                            Functions.ApplyShadow();
                        }
                    });
                    TweenMax.to(Form, 1, {
                        top: 125,
                        delay: 0.75,
                        ease: Power4.easeOut
                    });
                }
                return Functions;
            },
            Close: function () {
                if (State === EnvelopeStates.Opened) {
                    TweenMax.to(SubmitTop, 0.5, {
                        fill: '#808080',
                        ease: Power4.easeOut
                    });
                    TweenMax.to(SubmitBottom, 0.5, {
                        fill: '#808080',
                        ease: Power4.easeOut
                    });
                    if (Functions.ValidateForm()) {
                        State = EnvelopeStates.Closing;
                        TweenMax.to(SubmitLayer, 0.5, {
                            opacity: 0,
                            y: 100,
                            ease: Power4.easeOut
                        });
                        TweenMax.set(ShadowPolygon, {
                            y: 0
                        });
                        TweenMax.to(Form, 1, {
                            top: 314,
                            ease: Power4.easeOut
                        });
                        TweenMax.to(Page, 1, {
                            attr: {
                                y: 300
                            },
                            onUpdate: function () {
                                ShadowPoints.y1 = parseInt($(this.target).attr('y'));
                                ShadowPoints.y2 = ShadowPoints.y1 < 185 ? ShadowPoints.y1 + 30 : 215;
                                ShadowPoints.y3 = ShadowPoints.y2 + 100;
                                Functions.ApplyShadow();
                            },
                            ease: Power4.easeOut
                        });
                        if (IsChrome()) {
                            TweenMax.to(BackCover, 1, {
                                rotationX: 90,
                                transformOrigin: '50% 100%',
                                fill: '#888888',
                                ease: Linear.easeOut,
                                onComplete: function () {
                                    TweenMax.set(FrontCover, {
                                        display: 'inline',
                                        opacity: 1
                                    });
                                    TweenMax.to(FrontCover, 0.5, {
                                        rotationX: 180,
                                        transformOrigin: '50% 100%',
                                        ease: Power4.easeOut,
                                        onComplete: function () {
                                            TweenMax.to(Element, 1, {
                                                y: 285,
                                                onComplete: function () {
                                                    Functions.SendMessage();
                                                }
                                            });
                                            State = EnvelopeStates.Closed;
                                        }
                                    });
                                }
                            });
                        } else {
                            TweenMax.to(Element, 1, {
                                y: 500,
                                onComplete: function () {
                                    Functions.SendMessage();
                                }
                            });
                            State = EnvelopeStates.Closed;
                        }
                    } else {
                        var ValidateNameFlag = Functions.ValidateName(),
                            ValidateEmailFlag = Functions.ValidateEmail(),
                            ValidateMessageFlag = Functions.ValidateMessage();
                        if (ValidateNameFlag && ValidateEmailFlag && ValidateMessageFlag) {
                            ErrorMessage.text('Please provide valid data!');
                        } else if (ValidateNameFlag) {
                            ErrorMessage.text('Please provide a valid Full Name!');
                        } else if (ValidateEmailFlag) {
                            ErrorMessage.text('Please provide a valid Email ID!');
                        } else if (ValidateMessageFlag) {
                            ErrorMessage.text('Please provide a valid Message!');
                        }
                        TweenMax.fromTo(ErrorMessage, 0.5, {
                            marginTop: 20,
                            opacity: 0
                        }, {
                            marginTop: 0,
                            opacity: 1,
                            ease: Power4.easeOut,
                            onComplete: function () {
                                TweenMax.to(ErrorMessage, 0.5, {
                                    marginTop: -20,
                                    opacity: 0,
                                    delay: 2,
                                    ease: Power4.easeOut
                                });
                            }
                        });
                        if (ValidateNameFlag) {
                            Functions.ValidationResponse(Name, true);
                        }
                        if (ValidateEmailFlag) {
                            Functions.ValidationResponse(Email, true);
                        }
                        if (ValidateMessageFlag) {
                            Functions.ValidationResponse(Message, true);
                        }
                    }
                }
            },
            SubmitHover: function () {
                if (State == EnvelopeStates.Opened) {
                    TweenMax.to(SubmitLayer, 0.5, {
                        y: -10,
                        ease: Power4.easeOut
                    });
                    TweenMax.to(SubmitTop, 0.5, {
                        fill: '#909090',
                        ease: Power4.easeOut
                    });
                    TweenMax.to(SubmitBottom, 0.5, {
                        fill: '#909090',
                        ease: Power4.easeOut
                    });
                }
            },
            SubmitDown: function () {
                if (State == EnvelopeStates.Opened) {
                    TweenMax.to(SubmitTop, 0.5, {
                        fill: '#747474',
                        ease: Power4.easeOut
                    });
                    TweenMax.to(SubmitBottom, 0.5, {
                        fill: '#747474',
                        ease: Power4.easeOut
                    });
                }
            },
            SubmitReset: function () {
                if (State == EnvelopeStates.Opened) {
                    TweenMax.to(SubmitLayer, 0.5, {
                        y: 0,
                        ease: Power4.easeOut
                    });
                    TweenMax.to(SubmitTop, 0.5, {
                        fill: '#808080',
                        ease: Power4.easeOut
                    });
                    TweenMax.to(SubmitBottom, 0.5, {
                        fill: '#808080',
                        ease: Power4.easeOut
                    });
                }
            },
            Hover: function () {
                if (State == EnvelopeStates.Opened) {
                    TweenMax.to(ShadowPolygon, 1, {
                        y: -111,
                        ease: Power4.easeOut
                    });
                    TweenMax.to(Page, 1, {
                        attr: {
                            y: 0
                        },
                        ease: Power4.easeOut
                    });
                    TweenMax.to(Form, 1, {
                        top: 14,
                        ease: Power4.easeOut
                    });
                }
            },
            Reset: function () {
                if (State == EnvelopeStates.Opened) {
                    TweenMax.to(ShadowPolygon, 1, {
                        y: 0,
                        ease: Power4.easeOut
                    });
                    TweenMax.to(Page, 1, {
                        attr: {
                            y: 111
                        },
                        ease: Power4.easeOut
                    });
                    TweenMax.to(Form, 1, {
                        top: 125,
                        ease: Power4.easeOut
                    });
                    Name.blur();
                    Email.blur();
                    Message.blur();
                }
            },
            Bind: function () {
                Page.on('mouseenter', Functions.Hover);
                Form.on('mouseenter', Functions.Hover);
                EnvelopeBack.on('mouseleave', Functions.Reset);
                Functions.TextBind(Name, NameTag, Functions.ValidateName);
                Functions.TextBind(Email, EmailTag, Functions.ValidateEmail);
                Functions.TextBind(Message, MessageTag, Functions.ValidateMessage);
                Functions.TextAreaBind(Message, MessageTag, MessageCount);
                Name.on('click', Functions.Hover);
                Email.on('click', Functions.Hover);
                Message.on('click', Functions.Hover);
                SubmitLayer.on('mouseover', Functions.SubmitHover);
                SubmitLayer.on('mousedown', Functions.SubmitDown);
                SubmitLayer.on('mouseup', Functions.Close);
                SubmitLayer.on('mouseout', Functions.SubmitReset);
                Message.elastic();
            },
            UnBind: function () {
                Form.unbind();
                Page.unbind();
                EnvelopeBack.unbind();
                Name.unbind();
                Email.unbind();
                Message.unbind();
                EnvelopeFront.unbind();
                SubmitLayer.unbind();
            }
        };
        EnvelopeBack.on('load', function () {
            EnvelopeBackDoc = EnvelopeBack[0].contentDocument;
            EnvelopeBackRoot = EnvelopeBackDoc.documentElement;
            ShadowPolygon = $('#Shadow', EnvelopeBackRoot);
            BackLayer = $('#BackLayer', EnvelopeBackRoot);
            Back = $('#Back', BackLayer);
            BackCoverLayer = $('#CoverLayer', EnvelopeBackRoot);
            BackCover = $('#Cover', BackCoverLayer);
            PageLayer = $('#PageLayer', EnvelopeBackRoot);
            Page = $('#Page', PageLayer);
            TweenMax.set(Form, {
                top: 306
            });
            TweenMax.set(Page, {
                attr: {
                    y: 300
                }
            });
            if (IsChrome()) {
                TweenMax.set(BackCover, {
                    rotationX: 90,
                    transformOrigin: '50% 100%'
                });
            }
            TweenMax.set(Element, {
                y: 285
            });
            ShadowPoints.y1 = 215;
            ShadowPoints.y2 = 215;
            ShadowPoints.y3 = 315;
            Functions.ApplyShadow();
        });
        EnvelopeFront.on('load', function () {
            EnvelopeFrontDoc = EnvelopeFront[0].contentDocument;
            EnvelopeFrontDocObject = $(EnvelopeFrontDoc);
            EnvelopeFrontRoot = EnvelopeFrontDoc.documentElement;
            FrontCoverLayer = $('#CoverLayer', EnvelopeFrontRoot);
            FrontCover = $('#Cover', FrontCoverLayer);
            FrontLayer = $('#FrontLayer', EnvelopeFrontRoot);
            Front = $('#Front', FrontLayer);
            SubmitLayer = $('#SubmitLayer', EnvelopeFrontRoot);
            SubmitTop = $('#SubmitTop', SubmitLayer);
            SubmitBottom = $('#SubmitBottom', SubmitLayer);
            if (IsChrome()) {
                TweenMax.set(FrontCover, {
                    rotationX: 180,
                    transformOrigin: '50% 100%'
                });
            } else {
                FrontCover.css('display', 'none');
            }
            TweenMax.set(SubmitLayer, {
                opacity: 0,
                y: 100
            });
        });
        return Functions;
    };
    $.fn.WhoWeAre = function () {
        var Element = this,
            WhoWeAreContent = $('#WhoWeAreContentSVG', Element),
            WhoWeAreContentRootObject,
            WhoWeAreContentDrawSVG,
            WhoWeAreTextArray,
            WhoWeAreTextArrayLength,
            WhoWeAreIcons = $('#WhoWeAreIconsSVG', Element),
            WhoWeAreIconsRootObject,
            WhoWeAreIconsDrawSVG,
            Started = false;
        var Functions = {
            Enter: function () {
                if (WhoWeAreContentDrawSVG !== undefined) {
                    WhoWeAreIconsDrawSVG.drawsvg('animate');
                    WhoWeAreContentDrawSVG.drawsvg('animate');
                    var i = 0;
                    for (; i < WhoWeAreTextArrayLength; i++) {
                        TweenMax.to(WhoWeAreTextArray[i], 0.5, {
                            opacity: 1,
                            y: 0,
                            delay: 0.1 * i,
                            ease: Power4.easeOut
                        });
                    }
                    Started = true;
                }
            },
            Play: function () {
                if (Started) {

                } else {
                    Functions.Enter();
                }
            }
        };
        WhoWeAreContent.on('load', function () {
            WhoWeAreContentRootObject = $(WhoWeAreContent[0].contentDocument.documentElement);
            WhoWeAreContentDrawSVG = WhoWeAreContentRootObject.drawsvg({
                duration: 1000,
                ease: 'swing'
            });
            WhoWeAreTextArray = WhoWeAreContentRootObject.find('#TextParagraph path');
            WhoWeAreTextArrayLength = WhoWeAreTextArray.length;
            var i = 0;
            for (; i < WhoWeAreTextArrayLength; i++) {
                TweenMax.set(WhoWeAreTextArray[i], {
                    opacity: 0,
                    y: 50
                });
            }
        });
        WhoWeAreIcons.on('load', function () {
            WhoWeAreIconsRootObject = $(WhoWeAreIcons[0].contentDocument.documentElement);
            WhoWeAreIconsDrawSVG = WhoWeAreIconsRootObject.drawsvg({
                duration: 5000,
                ease: 'swing'
            });
        });
        return Functions;
    };
    $.fn.Helper = function (o) {
        var Element = this,
            RootObject,
            Front,
            Back,
            Options = $.extend({
                Width: 45,
                Height: 30,
                X: 'left',
                Y: 'bottom',
                OffsetX: 0,
                OffsetY: 0,
                RotateVertically: false,
                RotateClockwise: false,
                Duration: 1,
                Easing: Power4.easeOut,
                CallBackBind: undefined,
                CallBack: undefined
            }, o),
            Width = Options.Width,
            Height = Options.Height,
            HalfWidth = Width / 2,
            HalfHeight = Height / 2,
            X = Options.X,
            Y = Options.Y,
            OffsetX = Options.OffsetX,
            OffsetY = Options.OffsetY,
            RotateVertically = Options.RotateVertically,
            RotateClockwise = Options.RotateClockwise,
            Duration = Options.Duration,
            HalfDuration = Duration / 2,
            Easing = Options.Easing,
            PauseFlag = true,
            CallBackBind = Options.CallBackBind,
            CallBack = Options.CallBack;
        var Functions = {
            Position: function (WindowWidth, WindowHeight, HalfWindowWidth, HalfWindowHeight) {
                var x = OffsetX,
                    y = OffsetY;
                switch (X) {
                    case 'left':
                        x += 0;
                        break;
                    case 'middle':
                        x += HalfWindowWidth - (RotateVertically ? HalfHeight : HalfWidth);
                        break;
                    case 'right':
                        x += WindowWidth - (RotateVertically ? Height : Width);
                        break;
                }
                switch (Y) {
                    case 'top':
                        y += 0;
                        break;
                    case 'middle':
                        y += HalfWindowHeight - (RotateVertically ? HalfWidth : HalfHeight);
                        break;
                    case 'bottom':
                        y += WindowHeight - (RotateVertically ? Width : Height);
                        break;
                }
                Element.css({
                    left: x,
                    top: y
                });
                return Functions;
            },
            Animate: function () {
                TweenMax.to(Front, HalfDuration, {
                    x: -10,
                    scale: 1.2,
                    transformOrigin: '50% 50%',
                    onComplete: function () {
                        TweenMax.to(Front, HalfDuration, {
                            x: 0,
                            scale: 1,
                            transformOrigin: '50% 50%'
                        });
                    }
                });
                TweenMax.fromTo(Back, Duration, {
                    opacity: 1,
                    x: 0,
                    scale: 1,
                    transformOrigin: '50% 50%'
                }, {
                    opacity: 0,
                    x: 30,
                    scale: 0.8,
                    transformOrigin: '50% 50%',
                    ease: Easing,
                    onComplete: PauseFlag ? undefined : Functions.Animate
                });
                return Functions;
            },
            Play: function () {
                PauseFlag = false;
                Functions.Animate();
            },
            Pause: function () {
                PauseFlag = true;
            },
            Hide: function () {
                TweenMax.to(Element, HalfDuration, {
                    opacity: 0,
                    marginLeft: RotateVertically ? 0 : HalfWidth,
                    marginTop: RotateVertically ? (RotateClockwise ? 1 : -1) * HalfHeight : 0,
                    ease: Easing,
                    onComplete: function () {
                        Element.css('z-index', '-99');
                        if (!PauseFlag) {
                            Functions.Pause();
                        }
                    }
                });
            },
            Show: function () {
                Element.css('z-index', '99');
                TweenMax.to(Element, Duration, {
                    opacity: 1,
                    marginLeft: 0,
                    marginTop: 0,
                    ease: Easing,
                    onComplete: function () {
                        if (PauseFlag) {
                            Functions.Play();
                        }
                    }
                });
            }
        };
        Element.on('load', function () {
            RootObject = $(Element[0].contentDocument.documentElement)
                .on(CallBackBind, CallBack)
                .on('mouseover', function () {
                    TweenMax.to(Element, Duration, {
                        scale: 1.125,
                        transformOrigin: '50% 50%',
                        ease: Easing
                    });
                })
                .on('mouseout', function () {
                    TweenMax.to(Element, Duration, {
                        scale: 1,
                        transformOrigin: '50% 50%',
                        ease: Easing
                    });
                });
            Front = RootObject.find('#Front');
            Back = RootObject.find('#Back');
            RootObject.css({
                cursor: 'hand',
                cursor: 'pointer'
            });
            TweenMax.set(Element, {
                rotation: (RotateVertically ? RotateClockwise ? 90 : -90 : 0),
                transformOrigin: '50% 50%',
                opacity: 0,
                marginLeft: RotateVertically ? 0 : HalfWidth,
                marginTop: RotateVertically ? (RotateClockwise ? 1 : -1) * HalfHeight : 0
            });
        });
        return Functions;
    };
    $.fn.Link = function (o) {
        var Element = this,
            RootObject,
            Base,
            Options = $.extend({
                Width: 48,
                Height: 48,
                X: 'left',
                Y: 'bottom',
                OffsetX: 0,
                OffsetY: 0,
                Duration: 0.5,
                Easing: Power4.easeOut,
                CallBackBind: undefined,
                CallBack: undefined
            }, o),
            Width = Options.Width,
            Height = Options.Height,
            HalfWidth = Width / 2,
            HalfHeight = Height / 2,
            X = Options.X,
            Y = Options.Y,
            OffsetX = Options.OffsetX,
            OffsetY = Options.OffsetY,
            Duration = Options.Duration,
            HalfDuration = Duration / 2,
            Easing = Options.Easing,
            CallBackBind = Options.CallBackBind,
            CallBack = Options.CallBack;
        var Functions = {
            Position: function (WindowWidth, WindowHeight, HalfWindowWidth, HalfWindowHeight) {
                var x = OffsetX,
                    y = OffsetY;
                switch (X) {
                    case 'left':
                        x += 0;
                        break;
                    case 'middle':
                        x += HalfWindowWidth - HalfWidth;
                        break;
                    case 'right':
                        x += WindowWidth - Width;
                        break;
                }
                switch (Y) {
                    case 'top':
                        y += 0;
                        break;
                    case 'middle':
                        y += HalfWindowHeight - HalfHeight;
                        break;
                    case 'bottom':
                        y += WindowHeight - Height;
                        break;
                }
                Element.css({
                    left: x,
                    top: y
                });
                return Functions;
            },
            Hide: function () {
                TweenMax.to(Element, HalfDuration, {
                    opacity: 0,
                    scale: 0.5,
                    transformOrigin: '50% 50%',
                    ease: Easing,
                    onComplete: function () {
                        Element.css('z-index', '-99');
                    }
                });
            },
            Show: function () {
                Element.css('z-index', '99');
                TweenMax.to(Element, Duration, {
                    opacity: 1,
                    scale: 1,
                    transformOrigin: '50% 50%',
                    ease: Easing
                });
            }
        };
        Element.on('load', function () {
            RootObject = $(Element[0].contentDocument.documentElement)
                .on(CallBackBind, CallBack)
                .on('mouseover', function () {
                    TweenMax.to(Base, Duration, {
                        scale: 1,
                        transformOrigin: '50% 50%',
                        fill: '#00bebe',
                        ease: Easing
                    });
                })
                .on('mouseout', function () {
                    TweenMax.to(Base, Duration, {
                        scale: 0.75,
                        transformOrigin: '50% 50%',
                        fill: '#ffffff',
                        ease: Easing
                    });
                })
                .css({
                    cursor: 'hand',
                    cursor: 'pointer'
                });
            Base = $('#Base', RootObject);
            TweenMax.set(Base, {
                scale: 0.75,
                transformOrigin: '50% 50%'
            });
            TweenMax.set(Element, {
                opacity: 0,
                scale: 0.5,
                transformOrigin: '50% 50%'
            });
        });
        return Functions;
    };
    w['PlayGAWDS'] = function () {
        StartPageObject.Play();
    };
    w['PauseGAWDS'] = function () {
        StartPageObject.Pause();
    };
    w['WhoWeArePlay'] = function () {
        WhoWeAreObject.Play();
    };
    w['WhoWeArePause'] = function () {
    };
    w['WhatWeDoPlay'] = function () {
    };
    w['WhatWeDoPause'] = function () {

    };
    w['CardsPlay'] = function () {
        TweenMax.killTweensOf(MemberObjects);
        TweenMax.staggerTo(MemberObjects, 2, {
            scale: 1,
            opacity: 1,
            ease: Elastic.easeOut
        }, 0.02);
    };
    w['CardsPause'] = function () {
    };
    w['PlayEnvelope'] = function () {
        EnvelopeObject.Open();
    };
    w['PauseEnvelope'] = function () {
    };
    DocumentObject.on('ready', function () {
        ScrollObject = $('section').css({
            width: Width,
            height: Height
        }).ScrollPlugin('MainFrame',
            {
                FunctionsIn: ['PlayGAWDS', 'WhoWeArePlay', 'WhatWeDoPlay', 'CardsPlay', 'PlayEnvelope'],
                FunctionsOut: ['PauseGAWDS', 'WhoWeArePause', 'WhatWeDoPause', 'CardsPause', 'PauseEnvelope'],
                SideMenuButtonIcons: ['images/1.svg', 'images/2.svg', 'images/3.svg', 'images/4.svg', 'images/5.svg'],
                ScrollCallBack: function () {
                    NavigationHelperObject.Show();
                    if (ScrollObject.GetCurrent() === 5) {
                        ScrollDownHelperObject.Hide();
                    } else {
                        ScrollDownHelperObject.Show();
                    }
                },
                SideMenuOpenCallBack: function () {
                    NavigationHelperObject.Hide();
                    ScrollDownHelperObject.Hide();
                    FacebookLinkObject.Hide();
                    LinkedInLinkObject.Hide();
                },
                SideMenuCloseCallBack: function () {
                    NavigationHelperObject.Show();
                    FacebookLinkObject.Show();
                    LinkedInLinkObject.Show();
                    if (ScrollObject.GetCurrent() === 5) {
                        ScrollDownHelperObject.Hide();
                    } else {
                        ScrollDownHelperObject.Show();
                    }
                }
            },
            WindowObject);
        StartPageObject = $('#StartPage').StartPage({
            Width: Width,
            Height: Height,
            HalfWidth: HalfWidth,
            HalfHeight: HalfHeight,
            CallBack: function () {
                ScrollObject.EnableScroll();
                NavigationHelperObject.Show();
                ScrollDownHelperObject.Show();
                FacebookLinkObject.Show();
                LinkedInLinkObject.Show();
            }
        });
        EnvelopeObject = $('#Envelope').Envelope({
            FormMethod: 'POST',
            FormAction: 'post.php'
        }).RePosition(Width, Height, HalfWidth);
        WhoWeAreObject = $('#WhoWeAre').WhoWeAre();
        NavigationHelperObject = $('#NavigationHelper').Helper({
            X: 'left',
            Y: 'middle',
            OffsetX: 5,
            CallBackBind: 'mouseenter',
            CallBack: ScrollObject.OpenSideMenu
        }).Position(Width, Height, HalfWidth, HalfHeight);
        ScrollDownHelperObject = $('#ScrollDownHelper').Helper({
            X: 'middle',
            Y: 'bottom',
            RotateVertically: true,
            RotateClockwise: false,
            CallBackBind: 'click',
            CallBack: ScrollObject.ScrollDown
        }).Position(Width, Height, HalfWidth, HalfHeight);
        FacebookLinkObject = $('#FacebookLink').Link({
            X: 'right',
            Y: 'bottom',
            OffsetX: -30,
            OffsetY: -24,
            CallBackBind: 'click',
            CallBack: function () {
                w.open('http://www.facebook.com/gawdsnitkkr?fref=photo');
            }
        }).Position(Width, Height, HalfWidth, HalfHeight);
        LinkedInLinkObject = $('#LinkedInLink').Link({
            X: 'right',
            Y: 'bottom',
            OffsetX: -92,
            OffsetY: -24,
            CallBackBind: 'click',
            CallBack: function () {
                w.open('http://www.linkedin.com/company/graphics-and-web-development-squad');
            }
        }).Position(Width, Height, HalfWidth, HalfHeight);
        MemberObjects = $('.Member').each(function () {
            $(this).css('background-image', 'url("images/' + $(this).data('image') + '")');
        });
        TweenMax.set(MemberObjects, {
            scale: 0.5,
            opacity: 0,
            transformOrigin: '50% 50% 0'
        });
    });
    WindowObject.on('resize', function () {
        Width = w.innerWidth;
        Height = w.innerHeight;
        HalfWidth = Width / 2;
        HalfHeight = Height / 2;
        StartPageObject.Resize(Width, Height);
        EnvelopeObject.RePosition(Width, Height, HalfWidth);
        NavigationHelperObject.Position(Width, Height, HalfWidth, HalfHeight);
        ScrollDownHelperObject.Position(Width, Height, HalfWidth, HalfHeight);
        FacebookLinkObject.Position(Width, Height, HalfWidth, HalfHeight);
        LinkedInLinkObject.Position(Width, Height, HalfWidth, HalfHeight);
        $('section').css({
            width: Width,
            height: Height
        });
    });
})(window, document, jQuery);
