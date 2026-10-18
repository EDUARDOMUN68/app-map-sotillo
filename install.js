(() => {
  'use strict';
  let pending=null;
  const button=()=>document.getElementById('install-app');
  window.addEventListener('beforeinstallprompt',event=>{
    event.preventDefault();pending=event;
    if(button())button().hidden=false;
  });
  window.addEventListener('appinstalled',()=>{
    pending=null;if(button())button().hidden=true;
  });
  document.addEventListener('DOMContentLoaded',()=>{
    const control=button();
    if(!control)return;
    control.hidden=!pending;
    control.addEventListener('click',async()=>{
      if(!pending)return;
      const prompt=pending;pending=null;control.hidden=true;
      try{await prompt.prompt();await prompt.userChoice}catch(error){console.warn('No se pudo mostrar la instalación',error)}
    });
  });
  if('serviceWorker' in navigator){
    window.addEventListener('load',()=>{
      navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(error=>console.warn('No se pudo preparar la instalación sin conexión',error));
    });
  }
})();
