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

    socket.on('draw_line',data => {
        const line = data.line;
        //console.log('dibujo');
        //console.log(line);
        canvascontex.beginPath();
        canvascontex.lineWith=2;
        canvascontex.moveTo(line[0].x * width ,line[0].y * height )
        canvascontex.lineTo(line[1].x * width ,line[1].y * height  )
        //canvascontex.strokeStyle = "#2BA6CB";
        canvascontex.stroke();
    });
    socket.on('Clear_line',()=>{
        canvascontex.clearRect(0, 0, canvas.width, canvas.height);
    });


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

    function update(){
       if (mouse.click && mouse.move && mouse.position_prev){
            socket.emit('draw_line',{line:[mouse.position,mouse.position_prev]})
            mouse.move = false;
        } 
        mouse.position_prev={x:mouse.position.x, y:mouse.position.y};
        window.requestAnimationFrame(update);
    }
    update();
}
document.addEventListener('DOMContentLoaded',init)