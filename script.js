var character = document.getElementById("character");
var game = document.getElementById("game");
var interval;
var both = 0;
var counter = 0;
var currentBlocks = [];

function moveLeft(){
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if(left > 0){
        character.style.left = left - 2 + "px";
    }
}

function moveRight(){
    var left = parseInt(window.getComputedStyle(character).getPropertyValue("left"));
    if(left < 380){
        character.style.left = left + 2 + "px";
    }
}

document.addEventListener("keydown" , event => {
    if(both === 0){
        both++;
        if(event.key === "ArrowLeft"){
            interval = setInterval(moveLeft, 1);
        }
        if(event.key === "ArrowRight"){
            interval = setInterval(moveRight, 1);
        }
    }
});

document.addEventListener("keyup", event => {
    clearInterval(interval);
    both = 0;
});


let blocks = setInterval(function () {
    let blockLast = document.getElementById("block" + (counter - 1)); // second last block
    let holeLast = document.getElementById("hole" + (counter - 1)); // second last hole
    if (counter > 0) {
      // counter must be greater than 0 to check the second last block
      var blockLastTop = parseInt(
        window.getComputedStyle(blockLast).getPropertyValue("top")
      );
      var holeLastTop = parseInt(
        window.getComputedStyle(holeLast).getPropertyValue("top")
      );
    }
    // Generate blocks and holes only if they fit inside the game, meaning they should only be geneerated inside the game box
    if (blockLastTop < 400 || counter == 0) {
      var block = document.createElement("div");
      var hole = document.createElement("div");
      block.setAttribute("class", "block");
      hole.setAttribute("class", "hole");
      block.setAttribute("id", "block" + counter);
      hole.setAttribute("id", "hole" + counter);
      block.style.top = blockLastTop + 100 + "px"; // we selected the second last block and hole so we can give 100px distance between the last block created and the new block(second last block)
      hole.style.top = holeLastTop + 100 + "px";
      let random = Math.floor(Math.random() * 360); // width of the game(400) - width fo the hole(40) = 360
      hole.style.left = random + "px";
      game.appendChild(block);
      game.appendChild(hole);
      currentBlocks.push(counter); // Add the blocks and holes using the counter to the currentBlocks array
      counter++;
    }
    // Get the top and the left position of the character(ball)
    var characterTop = parseInt(
      window.getComputedStyle(character).getPropertyValue("top")
    );
    var characterLeft = parseInt(
      window.getComputedStyle(character).getPropertyValue("left")
    );
    var drop = 0; //To check if ball is on top of a block or hole
    if (characterTop <= 0) {
      alert("Game over. Score: " + (counter - 9));
      clearInterval(blocks);
      location.reload();
    }
    for (var i = 0; i < currentBlocks.length; i++) {
      let current = currentBlocks[i];
      let iblock = document.getElementById("block" + current); // iblock and ihole are the blocks and holes with same id(counter number)
      let ihole = document.getElementById("hole" + current);
      let iblockTop = parseFloat(
        window.getComputedStyle(iblock).getPropertyValue("top")
      );
      let iholeLeft = parseFloat(
        window.getComputedStyle(ihole).getPropertyValue("left")
      );
      iblock.style.top = iblockTop - 0.5 + "px";
      ihole.style.top = iblockTop - 0.5 + "px";
      if (iblockTop < -20) {
        // Remove the blocks from the array so they are gone from the game box
        currentBlocks.shift();
        iblock.remove();
        ihole.remove();
      }
      if (iblockTop - 20 < characterTop && iblockTop > characterTop) {
        drop++; // Drop will increase when ball is on a block
        if (iholeLeft <= characterLeft && iholeLeft + 20 >= characterLeft) {
          drop = 0; // Drop will be set back to 0 when it dros down a hole
        }
      }
    }
    if (drop == 0) {
      if (characterTop < 480) {
        // Stop the ball from falling below the game box
        character.style.top = characterTop + 2 + "px";
      }
    } else {
      character.style.top = characterTop - 0.5 + "px";
    }
  }, 1);