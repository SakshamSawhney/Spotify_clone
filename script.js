let songs =[];
var audio =new Audio();


async function playMusic(src){
    audio.src=src;
    audio.play();
    // console.log(src.split("/songs/")[1]);
    $(".song-info").html(src.split("/songs/")[1].replaceAll("%20"," "));
}



$(".card").hover(function(e){
    // alert("hover detected");

    $(this).children("img").addClass("play-transformed");
    // $(".card > img").toggleClass("p");
    
},function(){
    $(this).children("img").removeClass("play-transformed");

});

$(".scrollbar-container").hover(function(){
    // alert("hover detected");
    $(this).addClass('show-scrollbar');
},function(){
    $(this).removeClass('show-scrollbar');
});
function minutes(a) { 
    let minute = Math.floor(a/60);
    if(minute <10)return "0"+minute;
    return minute
}
function seconds(a) {
    let second= Math.ceil(a % 60);
    if(second<10)return "0"+Math.ceil(a % 60);
    return Math.ceil(a % 60);
}


$(".top-bar img[alt='hamburger']").on("click",function(){
    $(".left").css("left","0%");
});
$(".close-hamburger").on("click",function(){
    $(".left").css("left","-150%");
});


$("#playbar-prev").click(function(){
    let index = songs.indexOf(audio.src);
    if(index>0){
        playMusic(songs[index-1]);
    }
});
$("#playbar-next").click(function(){
    let index = songs.indexOf(audio.src);
    if(index<songs.length-1){
        playMusic(songs[index+1]);
    }
});


$(".volume").hover(function(){
    $(".volume input").css("display","block");
},function(){
    $(".volume input").css("display","none");
});
$(".volume input").change(function(e){
    console.log(e);
});

async function getSongs(){
    let a = await fetch("/songs/");
    let response = await a.text();
    console.log(response);
    let div = document.createElement("div");
    div.innerHTML=response;
    let as = div.getElementsByTagName("a");
    let songs=[];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href);
        }
        
    }
    return songs;

}


async function main(){
    audio = new Audio();

    songs = await getSongs();
    // console.log(songs);
    songs.forEach(element => {
        $(".songs-list ul").append("<li> <img src='./svg/playbar-play.svg' alt='play' style='width: 20px;' class='invert lib-play' > <img src='./svg/music.svg' alt='Song'><div class='info '>"+element.split("/songs/")[1].replaceAll('%20',' ')+"</div></li>");
    });

    $(".songs-list li").hover(function(){
        // console.log(this);
        $(this).children("img").filter(function() {
            return $(this).attr("alt").endsWith("play");
        }).addClass("lib-play-transformed");
        $(this).children("img").filter(function() {
            return $(this).attr("alt").endsWith("Song");
        }).addClass("opacity-dull");
        
    },function(){
        $(this).children("img").filter(function() {
            return $(this).attr("alt").endsWith("play");
        }).removeClass("lib-play-transformed");
        $(this).children("img").filter(function() {
            return $(this).attr("alt").endsWith("Song");
        }).removeClass("opacity-dull");
    
    });


    $(".songs-list li").click(function(){
        // console.log(this.getElementsByTagName("div")[0].innerHTML);
        $(".song-info").html(this.getElementsByTagName("div")[0].innerHTML);
        playMusic("./songs/"+this.getElementsByTagName("div")[0].innerHTML);
        // audio.play();
    });


    $("#playbar-play").click(function(){
        // console.log(audio.duration,audio.currentSrc);
        if(audio.paused){
            audio.play();
        }
        else{
            audio.pause();
        }

    });


    audio.addEventListener("timeupdate",function(){
        // console.log(minutes(audio.currentTime)+":"+seconds(audio.currentTime)+" / "+ minutes(audio.duration)+":"+seconds(audio.duration));
        // console.log(audio.currentTime/audio.duration*100);
        $(".song-time").html(minutes(audio.currentTime)+":"+seconds(audio.currentTime)+" / "+ minutes(audio.duration)+":"+seconds(audio.duration));
        $(".curr-progress").css("left",audio.currentTime/audio.duration*100+"%");
    });

    audio.addEventListener("pause",function(){
        // console.log("paused");
        $("#playbar-play img").attr("src","./svg/playbar-play.svg");
    });
    audio.addEventListener("playing",function(){
        // console.log("playing");
        $("#playbar-play img").attr("src","./svg/pause.svg");
    });

    $(".progressbar").click(function(e){
        // console.log(e.offsetX/e.target.getBoundingClientRect().width*100 +"%");
        let fraction =(e.offsetX/e.target.getBoundingClientRect().width);
        $(".curr-progress").css("left",fraction*100 +"%");
        audio.currentTime=fraction*audio.duration;
    });

}



main();
