document.addEventListener('DOMContentLoaded', ()=>{
  const ROWS=10, COLS=10;
  const initialMaze = [
    [1,1,1,1,1,1,1,1,1,1],
    [1,2,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,1,1],
    [1,0,0,1,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
  ];
  let maze = [];
  const gameArea = document.getElementById('gameArea');
  const playBtn = document.getElementById('playBtn');
  const startOverlay = document.getElementById('startOverlay');
  const scoreCounter = document.getElementById('scoreCounter');
  const livesList = document.getElementById('livesList');
  const messageArea = document.getElementById('messageArea');
  const controlLeft = document.getElementById('lbttn');
  const controlUp = document.getElementById('ubttn');
  const controlRight = document.getElementById('rbttn');
  const controlDown = document.getElementById('dbttn');

  let playerR=1, playerC=1;
  let score=0, lives=3;
  let running=false;
  let enemies=[]; // {r,c}
  const ENEMY_COUNT = 3;
  const ENEMY_INTERVAL = 600; // ms

  function cloneMaze(){ return initialMaze.map(r=>r.slice()); }

  function resetMaze(){
    maze = cloneMaze();
    placeEnemies(ENEMY_COUNT);
    score=0; lives=3; running=false;
    updateHUD();
    render();
  }

  function placeEnemies(n){
    // clear previous 3s
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(maze[r][c]===3) maze[r][c]=0;
    enemies = [];
    let placed=0, attempts=0;
    while(placed<n && attempts<1000){
      attempts++;
      const r=Math.floor(Math.random()*ROWS);
      const c=Math.floor(Math.random()*COLS);
      if(maze[r][c]===0 && !(r===1 && c===1)){
        maze[r][c]=3;
        enemies.push({r,c});
        placed++;
      }
    }
  }

  function render(){
    gameArea.innerHTML='';
    for(let r=0;r<ROWS;r++){
      for(let c=0;c<COLS;c++){
        const block=document.createElement('div');
        block.className='block';
        block.dataset.r=r; block.dataset.c=c;
        const val = maze[r][c];
        if(val===1){ block.classList.add('wall'); }
        else if(val===2){
          const p=document.createElement('div'); p.id='player';
          const mouth=document.createElement('div'); mouth.className='mouth';
          p.appendChild(mouth); block.appendChild(p);
          playerR=r; playerC=c;
        } else if(val===3){
          const e=document.createElement('div'); e.className='enemy'; block.appendChild(e);
        } else if(val===0){
          const pt=document.createElement('div'); pt.className='point'; block.appendChild(pt);
        }
        gameArea.appendChild(block);
      }
    }
    updateHUD();
  }

  function updateHUD(){
    scoreCounter.innerText = score;
    livesList.innerHTML='';
    for(let i=0;i<lives;i++){ const li=document.createElement('li'); livesList.appendChild(li); }
  }

  function tryMovePlayer(dr,dc){
    if(!running) return;
    const nr=playerR+dr, nc=playerC+dc;
    if(nr<0||nr>=ROWS||nc<0||nc>=COLS) return;
    const cell = maze[nr][nc];
    if(cell===1) return; // wall
    if(cell===3){ // enemy -> hit
      handlePlayerHit();
      return;
    }
    if(cell===0){ // point
      score++; maze[nr][nc]=4; // eaten (4 empty)
    }
    // move player
    maze[playerR][playerC]=4;
    playerR=nr; playerC=nc;
    maze[playerR][playerC]=2;
    render();
    checkWin();
  }

  function handlePlayerHit(){
    lives--; updateHUD();
    if(lives<=0){ endGame(false); return; }
    // respawn
    // clear any player markers
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(maze[r][c]===2) maze[r][c]=4;
    maze[1][1]=2;
    render();
  }

  function endGame(won){
    running=false;
    const overlay=document.createElement('div'); overlay.className='startDiv';
    const inner=document.createElement('div'); inner.className='start';
    const h=document.createElement('h1'); h.innerText = won? 'You Win!' : 'Game Over';
    const btn=document.createElement('button'); btn.innerText='Restart'; btn.className='big';
    btn.addEventListener('click', ()=>{ document.body.removeChild(overlay); startOverlay.style.display='none'; resetAndStart(); });
    inner.appendChild(h); inner.appendChild(btn); overlay.appendChild(inner); document.body.appendChild(overlay);
  }

  function resetAndStart(){ resetMaze(); startOverlay.style.display='none'; running=true; }

  function moveEnemiesOnce(){
    const moves = [];
    for(const e of enemies){
      const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
      const options = [];
      for(const d of dirs){
        const nr = e.r + d[0], nc = e.c + d[1];
        if(nr>=0 && nr<ROWS && nc>=0 && nc<COLS && maze[nr][nc]!==1 && maze[nr][nc]!==3){
          options.push([nr,nc]);
        }
      }
      if(options.length===0) moves.push([e.r,e.c,e.r,e.c]);
      else {
        const pick = options[Math.floor(Math.random()*options.length)];
        moves.push([e.r,e.c,pick[0],pick[1]]);
      }
    }
    // apply moves sequentially; if target is player => hit; avoid overwriting by checking current state
    for(const m of moves){
      const [fr,fc,tr,tc] = m;
      // safety check bounds
      if(tr<0||tr>=ROWS||tc<0||tc>=COLS) continue;
      if(maze[tr][tc]===2){ handlePlayerHit(); maze[fr][fc]=4; maze[tr][tc]=3; }
      else if(maze[tr][tc]===0 || maze[tr][tc]===4){
        maze[fr][fc]=4; maze[tr][tc]=3;
      } else {
        // occupied by other enemy or wall - stay
      }
    }
    // rebuild enemies array from maze
    enemies = [];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(maze[r][c]===3) enemies.push({r,c});
    render();
  }

  function checkWin(){
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(maze[r][c]===0) return;
    endGame(true);
  }

  // attach controls
  document.addEventListener('keydown', (e)=>{
    if(!running) return;
    if(e.key==='ArrowUp') tryMovePlayer(-1,0);
    if(e.key==='ArrowDown') tryMovePlayer(1,0);
    if(e.key==='ArrowLeft') tryMovePlayer(0,-1);
    if(e.key==='ArrowRight') tryMovePlayer(0,1);
  });
  controlLeft.addEventListener('click', ()=>{ tryMovePlayer(0,-1); });
  controlRight.addEventListener('click', ()=>{ tryMovePlayer(0,1); });
  controlUp.addEventListener('click', ()=>{ tryMovePlayer(-1,0); });
  controlDown.addEventListener('click', ()=>{ tryMovePlayer(1,0); });

  // enemy timer
  setInterval(()=>{
    if(!running) return;
    moveEnemiesOnce();
  }, ENEMY_INTERVAL);

  playBtn.addEventListener('click', ()=>{ resetAndStart(); });

  // initialize
  resetMaze();
});