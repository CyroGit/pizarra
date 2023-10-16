module.exports=io =>{
    var line_history=[];
    io.on('connection', socket =>{
        console.log('new user connected');
    for(let i in line_history){
        socket.emit('draw_line',{line:line_history[i]})
    }
        //socket.emit('dra_line',)

        socket.on('draw_line',data=>{
           // console.log(data);
            line_history.push(data.line);
            io.emit('draw_line',data)
        })
        socket.on('Clear_line',()=>{
            io.emit('Clear_line');
            line_history.pop;
        })

    })
}