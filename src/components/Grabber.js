import React, { useEffect } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";


function Grabber({ userAccount, setUserAccount }) {
    const { unityProvider } = useUnityContext({
        loaderUrl: "build/build.loader.js",
        dataUrl: "build/build.data",
        frameworkUrl: "build/build.framework.js",
        codeUrl: "build/build.wasm",
      });

    return (
        <div  >
                <Unity unityProvider={unityProvider} />
        </div>
    );
}

export default Grabber;
