function init(){
    let mouse ={
        click:false,
        move:false,
        position:{x:0,y:0},
        position_prev:{x:0,y:0}
    };

   
    //canvas
    const canvas = document.getElementById('pizarra');
    const canvascontex = canvas.getContext('2d');
    const width= window.innerWidth;
    const height = window.innerHeight;

    canvas.width= width;
    canvas.height= height;
    canvascontex.fillStyle = 'white';
    canvascontex.fillRect(0,0,canvas.width, canvas.height);
    //canvas.style.backgroundColor = '#00F8'
    
    const socket = io();
    var colorbrush;
    socket.on('draw_line',data => {
        const line = data.line;
        
        //console.log('dibujo');
        //console.log(line);
        canvascontex.beginPath();
        canvascontex.lineWith=2;
        canvascontex.moveTo(line[0].x * width ,line[0].y * height )
        canvascontex.lineTo(line[1].x * width ,line[1].y * height  )
        canvascontex.strokeStyle = data.color;
        canvascontex.stroke();
    });
    socket.on('Clear_line',()=>{
        canvascontex.clearRect(0, 0, canvas.width, canvas.height);
    });
    socket.on('color_brush',datacolor=>{
        //canvascontex.strokeStyle =datacolor;
        colorbrush=datacolor;
    })


    canvas.addEventListener('mouseleave',(e)=>{
        mouse.click=false;
    });
    canvas.addEventListener('mousedown', (e)=>{
       //console.log(e);
       
        mouse.click= true;
    });
    canvas.addEventListener('mouseup',(e)=>{
        mouse.click=false;
    });
    canvas.addEventListener('mousemove',(e)=>{
        mouse.position.x= e.clientX/width;
        mouse.position.y= e.clientY/height;
        mouse.move= true;
    })

    //touch screen
    canvas.addEventListener('touchstart',(e)=>{
        mouse.position.x=  e.touches[0].clientX/width;
        mouse.position.y=  e.touches[0].clientY/height;
        mouse.position_prev={x:mouse.position.x, y:mouse.position.y};
       // mouse.position_prev={x: e.touches[0].clientX/width,y:e.touches[0].clientY/height};
        mouse.click=true;
       // console.log(e);
        //window.alert(e);
    });
    canvas.addEventListener('touchend',(e)=>{
        //mouse.position_prev={x: e.touches[0].clientX/width,y:e.touches[0].clientY/height};
        mouse.click=false;
       // console.log(e);
    });
    canvas.addEventListener("touchleave",(e)=>{
       // mouse.position_prev={x: e.touches[0].clientX/width,y:e.touches[0].clientY/height};
        mouse.click=false;
    });
    canvas.addEventListener('touchcancel',(e)=>{
        //mouse.position_prev={x: e.touches[0].clientX/width,y:e.touches[0].clientY/height};
        mouse.click=false;
        
    });

    canvas.addEventListener('touchmove',(e)=>{
        //mouse.position.x= e.clientX/width;
        //mouse.position.y= e.clientY/height;
        mouse.position.x=  e.touches[0].clientX/width;
        mouse.position.y=  e.touches[0].clientY/height;
        mouse.move= true;
        //window.alert( mouse.position.x);
    });


     //nav bar
     const nav_new = document.getElementById('newcanvas');
     nav_new.addEventListener('click',(e)=>{
         //console.log("nuevo canvas");
         socket.emit('Clear_line');
     }
     );
     const nav_save = document.getElementById('savecanvas');
        nav_save.addEventListener('click',(e)=>{
        nav_save.setAttribute('download', 'pizarra.jpeg');
        nav_save.setAttribute('href', canvas.toDataURL("image/jpeg", 1.0));
        //nav_save.click();
     }
     
     );
     const nav_colorbrush=document.getElementById('colorbrush');
     nav_colorbrush.addEventListener("change",(e)=>{
        //Envio el nuevo color;
        //console.log('el color: ' + e.target.value)
        socket.emit('color_brush',e.target.value);
     });

    function update(){
       if (mouse.click && mouse.move && mouse.position_prev){
            socket.emit('draw_line',{line:[mouse.position,mouse.position_prev], color:colorbrush})
            mouse.move = false;
        } 
        mouse.position_prev={x:mouse.position.x, y:mouse.position.y};
        window.requestAnimationFrame(update);
    }
    update();
}
document.addEventListener('DOMContentLoaded',init)