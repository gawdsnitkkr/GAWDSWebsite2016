/*
 Author : Divya Mamgai (2015)
 Requirement : jQuery with jQuery mousewheel plugin.
 */
(function ($) {
    $.fn.ScrollPlugin = function (mF, o, wO) {
        var SectionArray = [],
            SectionPositionArray = [],
            SectionHeadingArray = [],
            NumberOfSections = this.length,
            RawArray = this,
            MainFrame = $('#' + mF),
            Options = $.extend({
                FunctionsIn: [],
                FunctionsOut: [],
                SideMenu: true,
                SideMenuResponeArea: 20,
                SideMenuClass: 'ScrollPluginMenu',
                SideMenuButtonClass: 'ScrollPluginMenuButton',
                SideMenuButtonIcons: [],
                ScrollCallBack: undefined,
                SideMenuOpenCallBack: undefined,
                SideMenuCloseCallBack: undefined,
                Easing: Power4.easeOut,
                Duration: 1,
                ResizeSection: true
            }, o),
            FunctionsIn = Options.FunctionsIn,
            FunctionsOut = Options.FunctionsOut,
            SideMenu = Options.SideMenu,
            SideMenuResponeArea = Options.SideMenuResponeArea,
            SideMenuClass = Options.SideMenuClass,
            SideMenuButtonClass = Options.SideMenuButtonClass,
            SideMenuButtonIcons = Options.SideMenuButtonIcons,
            SideMenuButtonIconSize,
            SideMenuButtonIconSizeHalf,
            SideMenuButtons = [],
            SideMenuButtonImages = [],
            SideMenuObject,
            SideMenuWrapper,
            SideMenuOpened = false,
            MenuHalfHeight,
            ScrollCallBack = Options.ScrollCallBack,
            SideMenuOpenCallBack = Options.SideMenuOpenCallBack,
            SideMenuCloseCallBack = Options.SideMenuCloseCallBack,
            Easing = Options.Easing,
            Duration = Options.Duration,
            HalfDuration = Duration / 2,
            ResizeSection = Options.ResizeSection,
            WindowObject = wO || $(window),
            Window = WindowObject[0],
            WindowWidth = Window.innerWidth,
            WindowHeight = Window.innerHeight,
            WindowHalfHeight = WindowHeight / 2,
            Scrolling = false,
            EnableScroll = false,
            Current = 1,
            PreviousIndex = 0,
            i = 0;
        for (; i < NumberOfSections; i++) {
            SectionArray.push($(RawArray[i]));
            SectionPositionArray.push(SectionArray[i].position().top);
            SectionArray[i].css({
                position: 'relative',
                display: 'block',
                padding: 0,
                margin: 0
            });
            SectionArray[i].find('.Heading object').attr('section', i).on('load', function () {
                var Index = parseInt($(this).attr('section'));
                SectionHeadingArray[Index] = $(this.contentDocument.documentElement).drawsvg({
                    duration: 7000,
                    ease: 'swing'
                });
            });
            FunctionsIn[i] = FunctionsIn[i] || '';
            FunctionsOut[i] = FunctionsOut[i] || '';
            SideMenuButtonIcons[i] = SideMenuButtonIcons[i] || '';
        }
        SideMenuButtonIconSize = parseInt(SectionArray[0].width() * 0.05 - 20);
        SideMenuButtonIconSizeHalf = SideMenuButtonIconSize / 2;
        MenuHalfHeight = SideMenuButtonIconSizeHalf * NumberOfSections;
        var Functions = {
            PerformScroll: function (ScrollTo) {
                ScrollTo = ScrollTo || false;
                var Index = Current - 1,
                    FunctionIn = FunctionsIn[Index];
                Functions.HighlightCurrentSideMenuIcon();
                if ((ScrollCallBack !== undefined) && !SideMenuOpened) ScrollCallBack();
                if (SectionHeadingArray[Index] !== undefined) {
                    SectionHeadingArray[Index].drawsvg('animate');
                }
                TweenMax.to(MainFrame, Duration, {
                    y: -SectionPositionArray[Index],
                    ease: Easing,
                    onComplete: function () {
                        Scrolling = false;
                    }
                });
                TweenMax.to(SectionArray[Index], HalfDuration, {
                    scale: 0.9,
                    transformOrigin: '50% 50%',
                    marginLeft: SideMenuOpened ? -SideMenuButtonIconSizeHalf : 0,
                    ease: Easing,
                    onComplete: SideMenuOpened ? FunctionIn ? function () {
                        Scrolling = false;
                        if ($.isFunction(Window[FunctionIn])) {
                            Window[FunctionIn]();
                        }
                    } : function () {
                        Scrolling = false;
                    } : function () {
                        TweenMax.to(SectionArray[Index], HalfDuration, {
                            scale: 1,
                            transformOrigin: '50% 50%',
                            marginLeft: 0,
                            ease: Easing,
                            onComplete: FunctionIn ? function () {
                                Scrolling = false;
                                Window[FunctionIn]();
                            } : function () {
                                Scrolling = false;
                            }
                        });
                    }
                });
                if (ScrollTo && SideMenuOpened) {
                    if (PreviousIndex != Index && PreviousIndex !== -1) {
                        var FunctionOut = FunctionsOut[PreviousIndex];
                        if (FunctionOut) Window[FunctionOut]();
                    }
                    PreviousIndex = Index;
                } else {
                    if (PreviousIndex != Index) {
                        TweenMax.to(SectionArray[PreviousIndex], HalfDuration, {
                            scale: 0.9,
                            transformOrigin: '50% 50%',
                            ease: Easing,
                            onComplete: function () {
                                TweenMax.to(SectionArray[PreviousIndex], HalfDuration, {
                                    scale: 1,
                                    transformOrigin: '50% 50%',
                                    ease: Easing,
                                    onComplete: function () {
                                        if (PreviousIndex !== -1) {
                                            var FunctionOut = FunctionsOut[PreviousIndex];
                                            if (FunctionOut) Window[FunctionOut]();
                                        }
                                        PreviousIndex = Index;
                                    }
                                });
                            }
                        });
                    }
                }
            },
            ScrollDown: function () {
                if (!EnableScroll) return false;
                if (!Scrolling) {
                    Scrolling = true;
                    Current++;
                    if (Current <= NumberOfSections) {
                        Functions.PerformScroll();
                    } else {
                        Current = NumberOfSections;
                        Scrolling = false;
                    }
                }
            },
            ScrollUp: function () {
                if (!EnableScroll) return false;
                if (!Scrolling) {
                    Scrolling = true;
                    Current--;
                    if (Current >= 1) {
                        Functions.PerformScroll();
                    } else {
                        Current = 1;
                        Scrolling = false;
                    }
                }
            },
            ScrollTo: function (Count) {
                if (!EnableScroll) return false;
                if (Count >= 1 && Count <= NumberOfSections) {
                    Current = Count;
                    Functions.PerformScroll(true);
                }
            },
            ReSize: function (onlyMenu) {
                onlyMenu = onlyMenu || false;
                WindowWidth = Window.innerWidth;
                WindowHeight = Window.innerHeight;
                WindowHalfHeight = WindowHeight / 2;
                $('body').css({
                    perspective: WindowWidth
                });
                if (SideMenuObject !== undefined) {
                    SideMenuObject.css({
                        top: WindowHalfHeight - MenuHalfHeight
                    });
                }
                if (!onlyMenu) {
                    var j = 0,
                        Section;
                    for (; j < NumberOfSections; j++) {
                        Section = SectionArray[j];
                        if (ResizeSection) {
                            Section.css({
                                width: WindowWidth,
                                height: WindowHeight
                            });
                        }
                        SectionPositionArray[j] = Section.position().top;
                    }
                }
            },
            CreateSideMenu: function () {
                SideMenuObject = $('<div class="' + SideMenuClass + '"></div>').appendTo(SideMenuWrapper).css({
                    position: 'fixed',
                    display: 'block',
                    left: -SideMenuButtonIconSize - 10,
                    zIndex: 99
                });
                var j = 0;
                for (; j < NumberOfSections; j++) {
                    SideMenuButtons[j] = $('<div></div>')
                        .addClass(SideMenuButtonClass)
                        .attr({
                            section: j + 1
                        }).appendTo(SideMenuObject)
                        .css({
                            width: SideMenuButtonIconSize,
                            height: 'auto',
                            padding: 5,
                            cursor: 'pointer',
                            'user-select': 'none',
                            '-webkit-user-select': 'none',
                            '-moz-user-select': 'none',
                            '-o-user-select': 'none',
                            '-ms-user-select': 'none'
                        }).on('mouseover', function () {
                            var This = $(this);
                            TweenMax.to(This, HalfDuration, {
                                opacity: 1,
                                ease: Easing
                            });
                            TweenMax.to(This.find('object'), HalfDuration, {
                                marginLeft: 10,
                                ease: Easing
                            });
                        }).on('click', function () {
                            Functions.ScrollTo(parseInt($(this).attr('section')));
                        }).on('mouseout', function () {
                            var This = $(this);
                            TweenMax.to(This, HalfDuration, {
                                opacity: 0.5,
                                ease: Easing
                            });
                            TweenMax.to(This.find('object'), HalfDuration, {
                                marginLeft: 0,
                                ease: Easing
                            });
                        });
                    SideMenuButtonImages[j] = $('<object/>').attr({
                        section: j,
                        width: SideMenuButtonIconSize,
                        height: SideMenuButtonIconSize,
                        data: SideMenuButtonIcons[j],
                        type: 'image/svg+xml'
                    }).on('load', function () {
                        var Index = parseInt($(this).attr('section')),
                            ContentDocument = this.contentDocument;
                        if (ContentDocument !== null) {
                            SideMenuButtonImages[Index] = $(ContentDocument.documentElement).attr('section', Index + 1).on('click', function () {
                                Functions.ScrollTo(parseInt($(this).attr('section')));
                            });
                            if (Index === Current - 1) {
                                Functions.HighlightCurrentSideMenuIcon();
                            }
                        }
                        MenuHalfHeight = SideMenuObject.height() / 2;
                    }).appendTo(SideMenuButtons[j]);
                }
                Functions.HighlightCurrentSideMenuIcon().ReSize(true);
                return Functions;
            },
            HighlightCurrentSideMenuIcon: function () {
                if (SideMenu) {
                    var Index = Current - 1;
                    TweenMax.to(SideMenuButtonImages[Index].find('#Base'), HalfDuration, {
                        stroke: '#00BEBE',
                        fill: '#00BEBE',
                        ease: Power4.easeOut
                    });
                    if (PreviousIndex !== Index) {
                        TweenMax.to(SideMenuButtonImages[PreviousIndex].find('#Base'), HalfDuration, {
                            stroke: '#ffffff',
                            fill: '#ffffff',
                            ease: Power4.easeOut
                        });
                    }
                }
                return Functions;
            },
            OpenSideMenu: function () {
                if (!EnableScroll) return Functions;
                if (!SideMenuOpened) {
                    SideMenuOpened = true;
                    TweenMax.to(SideMenuWrapper, HalfDuration, {
                        width: SideMenuButtonIconSize + SideMenuButtonIconSizeHalf + 10,
                        opacity: 1
                    });
                    if (SideMenuOpenCallBack !== undefined) SideMenuOpenCallBack();
                    TweenMax.killDelayedCallsTo(SideMenuObject);
                    TweenMax.fromTo(SideMenuObject, HalfDuration, {
                        left: -SideMenuButtonIconSize - 10
                    }, {
                        left: 0,
                        ease: Easing
                    });
                    var j = 0;
                    for (; j < NumberOfSections; j++) {
                        TweenMax.to(SectionArray[j], HalfDuration, {
                            scale: 0.9,
                            transformOrigin: '50% 50%',
                            marginLeft: -SideMenuButtonIconSizeHalf,
                            ease: Easing
                        });
                        TweenMax.to(SideMenuButtons[j], HalfDuration, {
                            marginLeft: 10,
                            opacity: 0.5,
                            ease: Easing,
                            delay: j * 0.1
                        });
                    }
                    TweenMax.to(MainFrame, Duration, {
                        rotationY: -20,
                        transformOrigin: '50% 50%',
                        ease: Easing
                    });
                }
                return Functions;
            },
            CloseSideMenu: function () {
                if (SideMenuOpened) {
                    SideMenuOpened = false;
                    TweenMax.to(SideMenuWrapper, HalfDuration, {
                        width: SideMenuResponeArea,
                        opacity: 0
                    });
                    TweenMax.fromTo(SideMenuObject, HalfDuration, {
                        left: 0
                    }, {
                        left: -SideMenuButtonIconSize - 10,
                        ease: Easing,
                        delay: Duration
                    });
                    var j = 0;
                    for (; j < NumberOfSections; j++) {
                        TweenMax.to(SectionArray[j], HalfDuration, {
                            scale: 1,
                            transformOrigin: '50% 50%',
                            marginLeft: 0,
                            ease: Easing
                        });
                        TweenMax.to(SideMenuButtons[j], HalfDuration, {
                            marginLeft: -10,
                            opacity: 0,
                            ease: Easing,
                            delay: j * 0.1
                        });
                    }
                    TweenMax.to(MainFrame, Duration, {
                        rotationY: 0,
                        transformOrigin: '50% 50%',
                        ease: Easing,
                        onComplete: SideMenuCloseCallBack
                    });
                }
                return Functions;
            },
            EnableScroll: function () {
                EnableScroll = true;
                return Functions;
            },
            DisableScroll: function () {
                EnableScroll = false;
                return Functions;
            },
            /**
             * @return {number}
             */
            GetCurrent: function () {
                return Current;
            }
        };
        if (SideMenu) {
            SideMenuWrapper = $('<div class="SideMenuWrapper"></div>').appendTo(MainFrame.parent()).css({
                position: 'fixed',
                top: 0,
                left: 0,
                height: WindowHeight,
                width: SideMenuResponeArea,
                backgroundColor: '#000000',
                opacity: 0
            });
            Functions.CreateSideMenu();
            SideMenuWrapper.on('mouseenter', Functions.OpenSideMenu);
            SideMenuWrapper.on('mouseleave', Functions.CloseSideMenu);
        }
        WindowObject.on('mousewheel', function (e, delta) {
            e.preventDefault();
            if (!SideMenuOpened) {
                if (delta < 0) Functions.ScrollDown();
                else if (delta > 0) Functions.ScrollUp();
            }
        });
        WindowObject.on('keydown', function (e) {
            if (!SideMenuOpened) {
                if (e.keyCode === 38) {
                    e.preventDefault();
                    Functions.ScrollUp();
                } else if (e.keyCode === 40) {
                    e.preventDefault();
                    Functions.ScrollDown();
                }
            }
        });
        WindowObject.on('resize', function (e) {
            Functions.ReSize();
        });
        return Functions;
    };
})(jQuery);
