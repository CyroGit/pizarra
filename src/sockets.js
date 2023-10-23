module.exports=io =>{
    var line_history=[];
    //var colorbrush;
    io.on('connection', socket =>{
        console.log('new user connected');
    for(let i in line_history){
        console.log(line_history[i]);
        socket.emit('draw_line',line_history[i])
    }
        //socket.emit('dra_line',)

        socket.on('draw_line',data=>{
           // console.log(data);
            line_history.push(data);
           // console.log(line_history.line);
            io.emit('draw_line',data)
        })
        socket.on('Clear_line',()=>{
            io.emit('Clear_line');
            line_history=[];
        })
        socket.on('color_brush',datacolor =>{
            //colorbrush=datacolor;
            io.emit('color_brush',datacolor);
        })

    })
}