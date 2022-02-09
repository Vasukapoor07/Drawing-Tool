let canvasBoard = document.querySelector("canvas")
let tool = canvasBoard.getContext("2d")
let tool3 = document.querySelector(".tool3")
let outer = document.querySelector(".outer")
let body = document.querySelector("body")



// Pencil, eraser, rectangle, cicle, line all selectors are here.
let pencil = document.querySelector("#pencil")
let eraser = document.querySelector("#eraser")
let rectTool = document.querySelector("#rect")
let lineTool = document.querySelector("#line")
let circleTool = document.querySelector(".tools3")



// Increaing the size of stroke from these two selector.
let sizem = document.querySelector(".sizem")
let sizep = document.querySelector(".sizep")



// Uploader and download selectors are here.
let uploadButton = document.querySelector("#uploadbtn")
let uploader = document.querySelector("#uploader")
let download = document.querySelector("#download")


// redo, undo selectors are here.
let redo = document.querySelector("#redoId");
let undo = document.querySelector("#undoId");


// Color selector are here.
let colorChange1 = document.querySelector(".color-change1") 
let colorChange2 = document.querySelector(".color-change2") 
let chooseColoe = document.querySelector(".choose-color")
let greenTool = document.querySelector(".green")
let blueTool = document.querySelector(".blue")
let redTool = document.querySelector(".red")



// Height and width of canvas we have set from these two line.
canvasBoard.height = window.innerHeight
canvasBoard.width = window.innerWidth



// These are the variable which help us to build image.
let currentX = canvasBoard.width / 2 
let currentY = canvasBoard.height / 2 
let draggable = false



// The function that is loading the image is here.
// Here we putting the code of uploading the img file
const reader = new FileReader()
const img = new Image()
const uploadImage = (e) => { 
    reader.onload = () => {
        img.onload = () => {
            tool.drawImage(img, currentX - img.width / 2, currentY - img.height / 2)
            // setInterval(() => {
            //     tool.drawImage(img, currentX - img.width / 2, currentY - img.height / 2)
            // }, 200)
        }
        img.src = reader.result
    }
    reader.readAsDataURL(e.target.files[0])
}



// Download the whole canvas as image in png format.
function onSave(){
    const flag = confirm("Do you want to download the canvas image?");
    if(flag){
        canvasBoard.toBlob((blob) => {
            const timeStamp = Date.now().toString(); // To make the name of every image different that's why we are adding this.
            const a = document.createElement("a");
            document.body.append(a);
            a.download = `export-${timeStamp}.png`; // name of the downloaded file
            a.href = URL.createObjectURL(blob); // This is the link of the image.
            a.click(); // click itself when we hit the button.
            a.remove(); // Removing it after downloading it.
        })
    }
}
download.addEventListener("click", onSave);



// if going out of canvas and if have up the mouse then we need to stop the drawing.
window.onmouseup = (e) => {
    drawingToolcheck = false;
}
 


// Upload happen from here.
uploadButton.addEventListener("click", () => {
    //So that when we draw the image or can say uplaod the image then in 
    // the background it doen't draw whatever tool that we have previously choose.
    drawingTool = "none" 
    uploader.click() // This click is pop to take the input.
    if(toolShowShapeDiv == true){
        outer.style.display = "none"
        toolShowShapeDiv = false
    }
})
// Here we have done is when change happen on screen just run this uploadImage function.
uploader.addEventListener("change", uploadImage)



// Size of our stroke is changing here...
sizem.addEventListener("click", function(e){
    toCheckDivShapes();
    if(tool.lineWidth >= 1){
        tool.lineWidth -= 4
    } 
})
sizep.addEventListener("click", function(e){
    if(tool.lineWidth <= 25){
        tool.lineWidth += 4
    } 
    toCheckDivShapes()
})



// Variables are declare here which we are using for tools and shapes.
let clickColor = "lightpink"
let boardLeft = canvasBoard.getBoundingClientRect().left
let boardTop = canvasBoard.getBoundingClientRect().top
let drawingTool 
let drawingToolcheck 
let strokecolor = "lightpink"
let iX, iY, fX, fY
let toolShowShapeDiv = true



// This will pop up the option to choose for shapes.
tool3.addEventListener("click", function(e){
    if(toolShowShapeDiv == false){
        outer.style.display = "flex"
        toolShowShapeDiv = true
    } else {
        outer.style.display = "none"
        toolShowShapeDiv = false
    }
})

// Here it is deciding that we want to display the div of shapes.
function toCheckDivShapes() {
    if(toolShowShapeDiv == true){
        outer.style.display = "none"
        toolShowShapeDiv = false
    }
}

// Event Listeners on tools it means which option do we choose will be go into process from here.
eraser.addEventListener("click", function(e){
    drawingTool = "eraser"
    strokecolor = "lightgoldenrodyellow"
    toCheckDivShapes()
})
pencil.addEventListener("click", function(e){
    drawingTool = "pencil"
    toCheckDivShapes()
})
rectTool.addEventListener("click", function(e){
    drawingTool = "recTool"
})
lineTool.addEventListener("click", function(e){
    drawingTool = "lineTool"
    
})
circleTool.addEventListener("click", function(e){
    drawingTool = "circleTool"
})



// After uploading the dragging of the image.
canvasBoard.onmousedown = (e) => {
    console.log(drawingTool)
    if( e.layerX <= (currentX + img.width/2)  && 
        e.layerX >= (currentX - img.width/2)  &&
        e.layerY <= (currentY + img.height/2) && 
        e.layerY >= (currentY - img.height/2)) {
            toCheckDivShapes();
            console.log(drawingToolcheck)
            drawingToolcheck = false;
            draggable = true;
            tool.fillStyle = "lightgoldenrodyellow";
            tool.fillRect(currentX - img.width/2, currentY - img.height/2, img.width, img.height);
            // tool.fill
    } else {
        draggable = false
        drawingToolcheck = true
    }

    if(drawingToolcheck == true){
        iX = e.clientX - boardLeft
        iY = e.clientY - boardTop
        if(strokecolor == "lightgoldenrodyellow" && drawingTool == "eraser"){
            strokecolor = "lightgoldenrodyellow"
        } else if(strokecolor == "lightgoldenrodyellow") {
            strokecolor = "lightpink"
        } else {
            strokecolor = clickColor
        }
        tool.strokeStyle = strokecolor;
        tool.beginPath()
        if(drawingTool == "pencil" || drawingTool == "eraser"){
            drawingToolcheck = true
        } 
    }
} 

canvasBoard.onmousemove = (e) => {  
    if(draggable){
        currentX = e.layerX
        currentY = e.layerY
    }
    if(drawingToolcheck == true && (drawingTool == "pencil" || drawingTool == "eraser")){
        fX = e.clientX - boardLeft;
        fY = e.clientY - boardTop;
        tool.lineTo(fX, fY);
        tool.stroke();
        iX = fX;
        iY = fY;
    }
}

canvasBoard.onmouseup = (e) => {
    if(draggable){
        draggable = false
        // uploadImage()
        tool.drawImage(img, currentX - img.width / 2, currentY - img.height / 2);
    }

    // Check here if we were doing some shapes or pencil like thing.
    if(drawingToolcheck == true){
        fX = e.clientX - boardLeft
        fY = e.clientY - boardTop
        let width = fX - iX
        let height = fY - iY
        if(drawingTool == "recTool"){
            tool.strokeRect(iX, iY, width, height)
        } else if(drawingTool == "lineTool") {
            tool.moveTo(iX, iY)
            tool.lineTo(fX, fY)
            tool.stroke()
        } else {
            midX = (iX + fX) / 2
            midY = (iY + fY) / 2
            dX = midX - fX
            dY = midY - fY
            let radius = Math.sqrt((dX * dX) + (dY * dY)) 
            tool.arc(midX, midY, radius, 0, Math.PI * 2, true)
            tool.stroke()
        }
    }
    drawingToolcheck = false
} 

// Color event listener through here color of stroke will change.
redTool.addEventListener("click", function(){
    clickColor = "lightpink"
    toCheckDivShapes()
})
greenTool.addEventListener("click", function(){
    clickColor = "lightgreen"
    toCheckDivShapes()
})
blueTool.addEventListener("click", function(){
    clickColor = "lightblue"
    toCheckDivShapes()
})


// Event listeners on body to draw the shapes.
// body.addEventListener("mousedown", function(e){
//     if(drawingToolcheck == true){
//         iX = e.clientX - boardLeft
//         iY = e.clientY - boardTop
//         if(strokecolor == "lightgoldenrodyellow" && drawingTool == "eraser"){
//             strokecolor = "lightgoldenrodyellow"
//         } else if(strokecolor == "lightgoldenrodyellow") {
//             strokecolor = "lightpink"
//         } else {
//             strokecolor = clickColor
//         }
//         console.log(clickColor)
//         tool.strokeStyle = strokecolor;
//         tool.beginPath()
//         if(drawingTool == "pencil" || drawingTool == "eraser"){
//             drawingToolcheck = true
//         } 
//     }
// // })
// body.addEventListener("mousemove", function(e){
//     if(drawingToolcheck == true){
//         fX = e.clientX - boardLeft;
//         fY = e.clientY - boardTop;
//         tool.lineTo(fX, fY);
//         tool.stroke();
//         iX = fX;
//         iY = fY;
//     } 
// })

// body.addEventListener("mouseup", function(e){
//     if(drawingToolcheck == true){
//         fX = e.clientX - boardLeft
//         fY = e.clientY - boardTop
//         let width = fX - iX
//         let height = fY - iY
//         if(drawingTool == "recTool"){
//             tool.strokeRect(iX, iY, width, height)
//         } else if(drawingToolcheck == true) {
//             tool.moveTo(iX, iY);
//             tool.lineTo(fX, fY);
//             tool.stroke();
//             drawingToolcheck = false
//         } else if(drawingTool == "lineTool") {
//             tool.moveTo(iX, iY)
//             tool.lineTo(fX, fY)
//             tool.stroke()
//         } else {
//             midX = (iX + fX) / 2
//             midY = (iY + fY) / 2
//             dX = midX - fX
//             dY = midY - fY
//             let radius = Math.sqrt((dX * dX) + (dY * dY)) 
//             tool.arc(midX, midY, radius, 0, Math.PI * 2, true)
//             tool.stroke()
//         }
//     }
// })




//Can add more colors if want through these options
// let voiletTool = document.querySelector(".voilet")
// let indigoTool = document.querySelector(".indigo")
// let yellowTool = document.querySelector(".yellow")
// let orangeTool = document.querySelector(".orange")
// let anycolorTool = document.querySelector(".anycolor")
// This is showing us the option of choosing the colors
// chooseColoe.addEventListener("click", function() {
//     colorChange1.style.display = "flex"
//     colorChange2.style.display = "flex"
// })
// voiletTool.addEventListener("click", function(){
//     clickColor = "darkvoilet"
// })
// indigoTool.addEventListener("click", function(){
//     clickColor = "darkindigo"
// })
// yellowTool.addEventListener("click", function(){
//     clickColor = "yellow"
// })
// orangeTool.addEventListener("click", function(){
//     clickColor = "orange"
// })
// anycolorTool.addEventListener("click", function(){
//     clickColor = "purple"
// })