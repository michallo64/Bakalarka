var range = 0;
var called = 1;
var dissapeard = 0;
var diffuse_light = document.getElementById("range");
var led_intensity = diffuse_light.value;

var source;

if (typeof (EventSource) != "undefined") {
    source = new EventSource("realDataSSE.php");
    source.onmessage = function (event) {
        range = parseInt(event.data);
        console.log("RPM: " + range + " Rychlost podelena 1100: " + range / 1100);
    }
} else {
    console.log("not working");
}

diffuse_light.oninput = function () {
    led_intensity = diffuse_light.value/100;
};

window.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById("canvas");
    var engine = new BABYLON.Engine(canvas, true);

    var createScene = function () {
        var scene = new BABYLON.Scene(engine);
        engine.enableOfflineSupport = false;

        scene.clearColor = new BABYLON.Color3.White();

        // Rotating Camera tuto pouzit pri bc
        var camera = new BABYLON.ArcRotateCamera("arcCamera",
            BABYLON.Tools.ToRadians(45),
            BABYLON.Tools.ToRadians(45),
            10.0,
            new BABYLON.Vector3.Zero(),
            scene);
        camera.attachControl(canvas, true);

        camera.keysUp.push(87);
        camera.keysDown.push(83);
        camera.keysLeft.push(65);
        camera.keysRight.push(68);

        var light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(0, 10, 0), scene);
        light.parent = camera;
        light.intensity = 1.0;
        //light.diffuse = new BABYLON.Color3(0.8, 1, 0.4);

        BABYLON.SceneLoader.ImportMesh("", "", "model/vrch.babylon", scene, function (newMeshes) {
            newMeshes.forEach(function (element) {
                // console.log(element.name);
            });
        });
        // console.log(scene.meshes);

        return scene;
    };

    var scene = createScene();

    engine.runRenderLoop(function () {

        var fanCover1 = scene.getMeshByID("fan_cover1");
        var fanCover2 = scene.getMeshByID("fan_cover2");
        var front_top_black = scene.getMeshByID("front_top_black") ;

        var inside_led = scene.getMeshByID("inside_led_yellow");
        var inside_led_bottom = scene.getMeshByID("inside_yellow_bulb_bottom");

        var fan = scene.getMeshByID("fan");

        if (fanCover1 && fanCover2 && called) {
            add_material(scene.getMeshByID("case1"), "case");
            add_material(scene.getMeshByID("case2"), "case");

            add_material(fanCover1, "case");
            add_material(fanCover2, "case");

            add_material(scene.getMeshByID("front_botton_black"), "fan");
            add_material(front_top_black, "fan");
            add_material(scene.getMeshByID("back_black"), "fan");

            add_material(scene.getMeshByID("legs"), "fan");

            add_material(fan, "fan");

            add_material(inside_led, "light_bulb");
            add_material(inside_led_bottom, "light_bulb");

            add_material(scene.getMeshByID("top_bulb_cable_red"), "cable_red");
            add_material(scene.getMeshByID("top_bulb_cable_black"), "cable_black");

            add_material(scene.getMeshByID("top_bulb_cable_black.001"), "cable_black");
            add_material(scene.getMeshByID("top_bulb_cable_black.002"), "cable_black");

            add_material(scene.getMeshByID("top_bulb_cable_red.001"), "cable_red");
            add_material(scene.getMeshByID("top_bulb_cable_red.002"), "cable_red");

            add_material(scene.getMeshByID("bulb_case_1"), "bulb_case");
            add_material(scene.getMeshByID("bulb_case_2"), "bulb_case");

            add_material(scene.getMeshByID("Cube.001"), "white_case");
            called = 0;
        }

        if (fanCover1 && fanCover2 && dissapeard) {
            fanCover1.material.alpha -= 0.01;
            fanCover2.material.alpha -= 0.01;
            front_top_black.material.alpha -= 0.01;
            if (fanCover1.material.alpha <= 0) dissapeard = 0;
        }

        if (fan) {
            fan.rotation.y += range / 1100;
            //console.log("Aktualna rotacia: "+fan.rotation+" RPM: "+range+" Rychlost podelena 1100: "+range/1100);
        }
        if(inside_led){
            inside_led.material.diffuseColor = new BABYLON.Color3(1-led_intensity, 1-led_intensity, 0);
        }

        scene.render();
    });

    function add_material(item, name) {
        switch (name) {
            case "case":
                var material = new BABYLON.StandardMaterial("material1", scene);
                material.diffuseTexture = new BABYLON.Texture("img/silver_texture.png", scene);
                material.roughness = 0.5;
                break;
            case "light_bulb":
                var material = new BABYLON.StandardMaterial("material2", scene);
                material.diffuseColor = new BABYLON.Color3.Yellow();
                break;
            case "fan":
                var material = new BABYLON.StandardMaterial("material3", scene);
                material.diffuseColor = new BABYLON.Color3.Black();
                break;
            case "cable_red":
                var material = new BABYLON.StandardMaterial("material4", scene);
                material.diffuseColor = new BABYLON.Color3.Red();
                break;
            case "cable_black":
                var material = new BABYLON.StandardMaterial("material5", scene);
                material.diffuseColor = new BABYLON.Color3.Black();
                break;
            case "bulb_case":
                var material = new BABYLON.StandardMaterial("material6", scene);
                material.diffuseColor = new BABYLON.Color3(0.520, 0.627, 0.627);
                break;
            case "white_cae":
                var material = new BABYLON.StandardMaterial("material7", scene);
                material.diffuseColor = new BABYLON.Color3.White();
                break;
        }
        item.material = material;
    }
})