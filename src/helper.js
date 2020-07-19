 export default function loadScript(src){  // To load Script async using promises
    return new Promise(function(resolve, reject) {
      let script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error(`Error occurred while loading script ${src}`));
  
      document.head.append(script);
    });
  }

  //Other helpers can be added here 

 