let img;
let numSegments = 50;//We will divide the image into segments
let segments = [];//We will store the segments in an array

//lets add a variable to switch between drawing the image and the segments
let drawSegments = false;

let imgDrwPrps = {aspect:0,width:0,height:0,xOffset:0,yOffset:0};

let canvasAspectRatio = 0;

//lets load the image from disk
function preload() {
  img = loadImage('/assets/Mona_Lisa.jpg');
}

function setup() {
  
  createCanvas(window.width, window.height);//set canvas size to entore window
  
imgDrwPrps.aspect = img.width/img.height;//calculate


calculateImageDrawProps();
  //We can use the width and height of the image to calculate the size of each segment
  let segmentWidth = img.width / numSegments;
  let segmentHeight = img.height / numSegments;

  let positionInColumn = 0;
  for (let segYPos=0; segYPos<img.height; segYPos+=segmentHeight) {
    //this is looping over the height
    let positionInRow = 0;
    for (let segXPos=0; segXPos<img.width; segXPos+=segmentWidth) {
      //We will use the x and y position to get the colour of the pixel from the image
      //lets take it from the centre of the segment
      let segmentColour = img.get(segXPos + segmentWidth / 2, segYPos + segmentHeight / 2);
       let segment = new ImageSegment(positionInColumn,positionInRow,segmentColour);
       segments.push(segment);
       positionInRow++;
    }
    positionInColumn++;
  }
  for (const segment of segments){
    segment.calculateSegDrawProps();
  }
}

function draw() {
  background(0);
  if (drawSegments) {
    //lets draw the segments to the canvas
    for (const segment of segments) {
      segment.draw();
    }
  } else {
    //lets draw the image to the canvas
    image(img, imgDrwPrps.xOffset,imgDrwPrps.yOffset,imgDrwPrps.width,imgDrwPrps.height);
  }
}
function keyPressed() {
  if (key == " ") {
    //this is a neat trick to invert a boolean variable,
    //it will always make it the opposite of what it was
    drawSegments = !drawSegments;
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  calculateImageDrawProps();
  for(const segment of segments){
    segment.calculateSegDrawProps();
  }
}

function calculateImageDrawProps(){
  canvasAspectRatio = width/height;
  //if the image is wider than the canvas
  if(imgDrwPrps.aspect > canvasAspectRatio){
    //then draw the image to the width of the canvas
    imgDrwPrps.width = width;
    //and calculate the height based on the aspect ratio
    imgDrwPrps.height = width/imgDrwPrps.aspect;
    imgDrwPrps.yOffset = (height - imgDrwPrps.height/2);
    imgDrwPrps.xOffset = 0;
  }else if(imgDrwPrps.aspect < canvasAspectRatio) {
    //otherwise draw the image to the height of the canvas
    imgDrwPrps.height = height;
    //and calculate the width based on the aspect ratio
    imgDrwPrps.width = height*imgDrwPrps.aspect;
    imgDrwPrps.xOffset = (width - imgDrwPrps.width)/2;
    imgDrwPrps.yOffset = 0;

  }else if(imgDrwPrps.aspect == canvasAspectRatio){
    //if the aspect ratios are the same we can draw rhe image to the canvas size
    imgDrwPrps.height = height;
    imgDrwPrps.width = width;
    imgDrwPrps.xOffset = 0;
    imgDrwPrps.yOffset = 0;
  }
}

//Here is our class for the image segments, we start with the class keyword
class ImageSegment {

  constructor(columnPositionInPrm, rowPostionInPrm  ,srcImgSegColourInPrm) {
    //Now we have changed the class a lot, instead of the x and y position of the segment, we will store the row and column position
    //The row and column position give us relative position of the segment in the image that do not change when the image is resized
    //We will use these to calculate the x and y position of the segment when we draw it

    this.columnPosition = columnPositionInPrm;
    this.rowPostion = rowPostionInPrm;
    this.srcImgSegColour = srcImgSegColourInPrm;
    //These parameters are not set when we create the segment object, we will calculate them later
    this.drawXPos = 0;
    this.drawYPos = 0;
    this.drawWidth = 0;
    this.drawHeight = 0;
  
    
  }
  
  calculateSegDrawProps() {
    //Here is where we will calculate the draw properties of the segment.
    //The width and height are easy to calculate, remember the image made of segments is always the same size as the whole image even when it is resized
    //We can use the width and height we calculated for the image to be drawn, to calculate the size of each segment
    this.drawWidth = imgDrwPrps.width / numSegments;
    this.drawHeight = imgDrwPrps.height / numSegments;
    
    //we can use the row and column position to calculate the x and y position of the segment
    //Here is a diagram to help you visualise what is going on
    
    //          column0 column1 column2 column3 column4
    //             ↓       ↓       ↓       ↓       ↓
    //    row0 → 0,0     0,1     0,2     0,3     0,4
    //    row1 → 1,0     1,1     1,2     1,3     1.4
    //    row2 → 2,0     2,1     2,2     2,3     2,4
    //    row3 → 3,0     3,1     3,2     3,3     3,4
    //    row4 → 4,0     4,1     4,2     4,3     4,4

    //The x position is the row position multiplied by the width of the segment plus the x offset we calculated for the image
    this.drawXPos = this.rowPostion * this.drawWidth + imgDrwPrps.xOffset;
    //The y position is the column position multiplied by the height of the segment plus the y offset we calculated for the image
    this.drawYPos = this.columnPosition * this.drawHeight + imgDrwPrps.yOffset;
  }

  draw() {
    //lets draw the segment to the canvas, for now we will draw it as an empty rectangle so we can see it
    stroke(0);
    fill(this.fillColor);
    rect(this.srcImgSegXPos, this.srcImgSegYPos, this.srcImgSegWidth, this.srcImgSegHeight);
  }
}