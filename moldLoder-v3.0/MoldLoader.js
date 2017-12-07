/*huangmei_6926@163.com 2017-10-25*/

/*
* @param 绘图区域的div id: divId
* @param 模型文件夹的根目录路径：pathName
* @param 存放于模型文件下的mtl文件名：mtlFile
* @param 存放于模型文件下的obj文件名: objFile
*/
MoldLoder = function (divId, pathName, mtlFile, objFile) {
    //探测webGL的支持情况
    if(!Detector.webgl)
        Detector.addGetWebGLMessage();
    var container,stats,camera,controls,scene,renderer,cross;

    this.init = function(){
        //相机初始化和参数设置
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
        camera.position.x = 100;
        camera.position.y = 200;
        camera.position.z = 100;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt( {x:0, y:0, z:0 } );

        //控制器初始化和参数设置
        controls = new THREE.TrackballControls( camera );
        controls.rotateSpeed = 5;
        controls.zoomSpeed = 1.2;
        controls.panSpeed = 1.5;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.addEventListener( 'change', render );

        //场景初始化和参数设置
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x000000 );

        //光线设置
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1);
        scene.add( light );
        var light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( -1, -1, -1 );
        scene.add( light );
        var light = new THREE.AmbientLight(0xffffff );
        scene.add( light );
        var directionalLight = new THREE.DirectionalLight( 0xffffff );
        directionalLight.position.set( -5, 5, 5).normalize();
        scene.add( directionalLight );
        var pointlight = new THREE.PointLight(0x63d5ff, 1, 200);
        pointlight.position.set(0, 0, 200);
        scene.add( pointlight );
        var pointlight2 = new THREE.PointLight(0xffffff, 1, 200);
        pointlight2.position.set(-200, 200, 200);
        scene.add( pointlight2 );
        var pointlight3 = new THREE.PointLight(0xffffff, 1.5, 200);
        pointlight3.position.set(-200, 200, 0);
        scene.add( pointlight3 );

        //模型加载进度监控函数
        var onProgress = function ( xhr ) {
            if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round(percentComplete, 2) + '% downloaded' );
            }
        };

        //模型加载错误处理函数
        var onError = function ( xhr ) { };
        THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

        //加载模型
        var mtlLoader = new THREE.MTLLoader();
      //  mtlLoader.setTexturePath(pathName);
        mtlLoader.setBaseUrl(pathName);
        mtlLoader.setPath(pathName);
        mtlLoader.load(mtlFile, function (materials){
            console.log("materials:");
            console.log(materials);
            materials.preload();

            var loader = new THREE.OBJLoader();
            loader.setPath(pathName);
            loader.setMaterials(materials);
            loader.load(objFile, function (object){
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material.side = THREE.DoubleSide;
                        child.material.transparent=true;
                        child.material.flatShading=THREE.SmoothShading;
                        if(child.material != undefined && child.material.emissive != undefined){
                            child.material.emissive.r=0;
                            child.material.emissive.g=0.01;
                            child.material.emissive.b=0.05;
                            child.material.transparent=true;//材质允许透明
                            child.material.shading=THREE.SmoothShading;//平滑渲染
                        }
                       // child.material.side = THREE.DoubleSide;
                    }
                });
              //  object.position.y = -95;
               /* object.emissive=0x00ffff;
                object.ambient=0x00ffff;*/
                object.scale.x = 2;
                object.scale.y = 2;
                object.scale.z = 2;
                scene.add(object);
            },onProgress, onError);
        });

        //渲染模型
        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container = document.getElementById(divId);
        container.appendChild( renderer.domElement );
        window.addEventListener( 'resize', onWindowResize, false );
        controls.update();
        animate();
    };

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize();
        animate();
    }

    function animate() {
        requestAnimationFrame( animate );
        render();
        controls.update();
    }

    function render() {
      //  camera.lookAt( scene.position );
        renderer.render( scene, camera );
    }

};


