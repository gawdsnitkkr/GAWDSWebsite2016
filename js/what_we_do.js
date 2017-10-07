$(document).ready(function (event) {
    var text_description = $("#text_description");
    var animated_portion = $("#animated_portion_inside");

    function display_earth() {

        TweenMax.to(".earth span", 5.3, {
            display: "block",
            onComplete: vanish_earth
        });
    }

    function display_solar() {
        TweenMax.to(".earth",0,{y:"-13px",x:"8px"});
        TweenMax.to(".earth", 1.3, {
            display: "block",
            opacity: 1,
            onComplete: display_earth
        });
    }

    function animation() {
        TweenMax.to($('.dot'), 0, {
            width: "80px",
            height: "80px"
        });

        moveTextUp("animd");
        TweenMax.to($("#circle4"), 0, {
            display: "block"
        });
        TweenMax.to($("#circle4"), 1, {
            scale: 10,
            border: "0px solid black",
            ease: Back.easeOut,
            onComplete: display_solar
        });
    }

    function rotate_three_circles() {
        TweenMax.to($("#animated_portion_inside"), .9, {
            rotationZ: "1440deg",
            scale: .1,
            onComplete: moveGraphicsTextDown
        });
        TweenMax.to($("#circle1"), 0.3, {
            display: "none"
        });
        TweenMax.to($("#circle2"), 0.3, {
            display: "none"
        });
        //$("#circle3").css("background-position","100px 50px");


    }

    function separate_three_circles() {

        TweenMax.to($("#circle1"), 1.8, {
            top: "-=15%",
            border: "1px solid black",
            ease: Back.easeOut,
            onComplete: rotate_three_circles
        });
        TweenMax.to($("#circle2"), 1.8, {
            left: "-=15%",
            border: "1px solid black ",
            ease: Back.easeOut
        });
        TweenMax.to($("#circle3"), 1.8, {
            top: "+=15%",
            border: "1px solid black",
            ease: Back.easeOut
        });
    }

    function add_three_circles() {

        var dot = document.createElement("div");
        dot.className = "dot";
        dot.id = "circle2";
        animated_portion.append(dot);
        dot = document.createElement("div");
        dot.className = "dot";
        dot.id = "circle3";
        animated_portion.append(dot);
        dot = document.createElement("div");
        dot.className = "dot";
        dot.id = "circle4";
        animated_portion.append(dot);
    }

    function graphics_designing() {
        moveTextUp("graphd"); //id of graphics_text
        TweenMax.to($("#left_bracket"), .5, {
            left: "48%",
            scale: 0,
            display: "none",
            ease: Back.easeOut
        });
        TweenMax.to($("#right_bracket"), .5, {
            right: "48%",
            scale: 0,
            display: "none",
            ease: Back.easeOut
        });
        add_three_circles();
        TweenMax.to($('.dot'), 1, {
            width: "100px",
            height: "100px",
            x: "-15",
            left: "-=7%",
            top: "-=10%",
            ease: Back.easeOut,
            onComplete: separate_three_circles
        });
        TweenMax.to($("#circle4"), 0, {
            display: "none"
        });
    }

    function add_slash() {
        $("#left_bracket h1").append("<span> /</span>");
        TweenMax.fromTo($("#left_bracket h1 span"), 1, {
            opacity: 0
        }, {
            opacity: 1,
            onComplete: moveWebDown,
            ease: Back.easeOut
        });

    }

    function web_development() {
        moveTextUp("webd");
        var dot = document.createElement("div");
        dot.className = "dot";
        dot.id = "circle1";
        animated_portion.append(dot);

        var left_bracket = document.createElement("div");
        left_bracket.id = "left_bracket";
        left_bracket.style.cssText = "opacity:0";
        animated_portion.append(left_bracket);

        var right_bracket = document.createElement("div");
        right_bracket.id = "right_bracket";
        right_bracket.style.cssText = "opacity:0";
        animated_portion.append(right_bracket);

        var left_bracket_h1 = document.createElement("h1");
        var left_bracket_text = document.createTextNode("<");
        left_bracket_h1.appendChild(left_bracket_text);
        left_bracket.appendChild(left_bracket_h1);

        var right_bracket_h1 = document.createElement("h1");
        var right_bracket_text = document.createTextNode(">");
        right_bracket_h1.appendChild(right_bracket_text);
        right_bracket.appendChild(right_bracket_h1);

        TweenMax.fromTo(left_bracket, 1, {
            opacity: 1,
            width: "10%",
            height: "10%",
            position: "absolute",
            left: "10%",
            top: "35%"
        }, {
            opacity: 1,
            left: "38%",
            top: "35%",
            width: "10%",
            height: "10%",
            position: "absolute",
            onComplete: add_slash,
            ease: Back.easeOut
        });
        TweenMax.fromTo(right_bracket, 1, {
            opacity: 1,
            width: "10%",
            height: "10%",
            position: "absolute",
            right: "10%",
            top: "35%"
        }, {
            opacity: 1,
            right: "35%",
            top: "35%",
            width: "10%",
            height: "10%",
            position: "absolute",
            ease: Back.easeOut
        });

    }

    function vanish_earth() {
        TweenMax.to(".earth span", 0.5, {
            opacity: 0,
            onComplete: moveAnimationTextDown
        });

    }

    function tv() {

        moveTextUp("videoid");
        TweenMax.to(".earth span", 0.1, {
            display: "none"
        });
        TweenMax.to(".earth", 0.5, {
            animation: "none",
            borderRadius: "0%",
            height: 230,
            width: 380,
            ease: Bounce.easeOut,
            left: "28.9%",
            top: "10%",
            onComplete: playTv
        });
    }

    function playTv() {
        TweenMax.to("#play-btn", 0.5, {
            opacity: 1,
            onComplete: disappear
        });
    }

    function disappear() {
        TweenMax.to("#play-btn", 0.5, {
            opacity: 0,
            onComplete: remove_sun,
            delay: 0.7
        });
    }

    function remove_sun() {
        TweenMax.to("#play-btn", 0.1, {
            display: "none"
        });
        TweenMax.to("#circle4", .7, {
            opacity: 0
        });
        TweenMax.to(".dot", 0, {
            opacity: 0,
            onComplete: moveVideoTextDown
        });
    }

    function make_lap() {
        TweenMax.to(".dot", 0.1, {
            display: "none",
            zIndex: 999999
        });
        TweenMax.to(".earth", 0.5, {
            y: 200,
            borderWidth: 5,
            borderRadius: "0%",
            height: 0,
            zIndex: 9999,
            onComplete: make_base
        });
    }

    function make_base() {
        TweenMax.to(".earth", 0.5, {
            width: 230,
            x: 60,
            onComplete: visib
        });
    }

    function visib() {
        TweenMax.to("#base", 1, {
            opacity: 1
        });
        TweenMax.to(".earth", 0.5, {
            transformOrigin: "0% 0%",
            onComplete: rotat
        });
    }

    function rotat() {

        moveTextUp("workid");
        TweenMax.to(".earth", 1, {
            width: "150px",
            y: "+=3.5"
        });
        TweenMax.to(".earth", 1, {
            rotationZ: "-110deg",
            borderWidth: "4px"
        });
        TweenMax.to("#base", 1, {
            width: "200px",
            onComplete: showlight
        });
        TweenMax.to(".jak", 0.3, {
            opacity: 1,
            delay: 1
        });
        TweenMax.to("#rec", 0.3, {
            opacity: 1,
            delay: 1,
            onComplete: print_three
        });
    }

    function showlight() {
        TweenMax.to("#img", 1, {
            opacity: 1,
            zIndex: 9999,
            delay: 0.2
        });
    }

    function print_three() {
        TweenMax.staggerTo(".flying_text", 0.7, {
            y: -155,
            opacity: 1,
            scale: 1.5
        }, 0.7);
        TweenMax.staggerTo(".flying_text", 0.7, {
            delay: 0.7,
            opacity: 0,
            display: "none"
        }, 0.7);
        make_dot();
    }

    function make_dot() {
        TweenMax.to("#img", 0.5, {
            opacity: 0,
            display: "none",
            delay: 2.7
        });
        TweenMax.to(".earth", 1, {
            rotationZ: "0deg",
            width: "200px",
            delay: 3.2,
            onComplete: moveWorkshopTextDown
        });
    }

    function dot() {
        TweenMax.to("#img", 0.5, {
            display: "none"
        });
        TweenMax.to("#base", 0.1, {
            display: "none",
            onComplete: final_dot
        });
    }

    function final_dot() {

        TweenMax.to(".earth", 0.6, {
            width: "5px",
            x: "180px",
            backgroundColor: "white",
            onComplete: dot_again
        });
    }

    function dot_again() {
        TweenMax.to("#img", 0, {
            display: "none"
        });
        TweenMax.to(".earth", 0.1, {
            borderRadius: "50%",
            height: "5px",
            onComplete: blastCircle
        });
        //TweenMax.to(".earth",0.1,{borderRadius:"50%",height:"5px",onComplete:makeCircleBigger});
    }

    /*  function makeCircleBigger(){
     TweenMax.to(".earth",0.5,{onComplete:popWebCircle,height:"140px",width:"140px",left:"20.8%",top:"-1.5px"});
     }*/

    function moveTextUp(id) {
        TweenMax.fromTo("#" + id, 0.5, {
            display: "none"
        }, {
            display: "block",
            y: "-160px"
        });
    }

    //this portion is to move every text down//
    function moveWebDown() {
        TweenMax.to("#webd", 0.4, {
            display: "none",
            y: "160px",
            onComplete: graphics_designing
        });
    }

    function moveGraphicsTextDown() {
        TweenMax.to("#graphd", 0.4, {
            display: "none",
            y: "160px",
            onComplete: animation
        });
    }

    function moveAnimationTextDown() {
        TweenMax.to("#animd", 0.4, {
            display: "none",
            y: "160px",
            onComplete: tv
        });
    }

    function moveVideoTextDown() {
        TweenMax.to("#videoid", 0.4, {
            display: "none",
            y: "160px",
            onComplete: make_lap
        });
    }

    function moveWorkshopTextDown() {
        TweenMax.to("#workid", 0.4, {
            display: "none",
            y: "160px",
            onComplete: dot
        });
    }

    function blastCircle() {
        TweenMax.to(".earth", 0, {
            display: "none"
        });
        TweenMax.to("#largestCircle", 0.1, {
            display: "block"
        });
        TweenMax.to("#home2", 1, {
            opacity: 1,
            delay: 1.5
        });
        TweenMax.to("#largestCircle", 1, {
            scale: 95,
            zIndex: 999
        });
        TweenMax.to("#home", 1, {
            opacity: 0,
            delay: 1.5
        });
        TweenMax.to("#home", 0, {
            display: "none",
            delay: 2.2
        });
        setTimeout(function () {
            location.reload();
        }, 1000);
    } 

    $("#circleOfButton").click(function () {
        TweenMax.to($("#home2"), 0, {
            display: "none"
        });
        TweenMax.to($("#home"), 0, {
            display: "block"
        });
        web_development();
    })

});
