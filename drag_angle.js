const floor = document.querySelector(".floor");
let isDragging = false;
let deltaX = 0, deltaY = 0;
let rotateX = 0, rotateY = 0;

//check dragging
floor.addEventListener("mousedown", function(event) {
    isDragging = true;
});
//check dragging is done
document.addEventListener("mouseup", function(event) {
    isDragging = false;
});
//rotate the square
document.addEventListener("mousemove", function(event) {
    if (isDragging) {
        deltaX = event.movementX;
        deltaY = event.movementY;

        rotateX += deltaY*0.2;
        rotateY += deltaX*0.2;

        floor.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
});