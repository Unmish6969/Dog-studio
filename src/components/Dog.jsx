import {React,use,useEffect} from 'react'
import * as THREE from 'three'
import {Canvas,useThree} from '@react-three/fiber'

import { OrbitControls,useGLTF,useTexture,useAnimations } from '@react-three/drei' 
//react-three-fiber is a react renderer for three.js
//it hides a lot of code already 
//scene light is already created by default
//All the hooks of react can be used only inside the Canvas component
//But we can also use camera scene as well

//canvas is to create a three.js canvas in react
//it is nothing but the DOM element where the 3D scene will be rendered which is returned in threejs by the renderer
 const Dog = () => {
    const model=useGLTF("/models/dog.drc.glb")
    useThree(({camera,scene,gl})=>{
        //console.log(camera.position)
        camera.position.z=0.7
        gl.toneMapping=THREE.ReinhardToneMapping
        gl.outputColorSpace=THREE.SRGBColorSpace
    })
    const {actions}=useAnimations(model.animations,model.scene);
    useEffect(()=>{
      actions["Take 001"].play()
    },[actions])
    // const textures=useTexture({
    //   normalMap:"models/dog_normals.jpg",
    //   sampleMatCap:"matcap/mat-2.png"
    // },(texture)=>{
    //   texture.flipY=false
    //   textures.colorSpace=THREE.SRGBColorSpace //for all it will be applied
    // })
    //to fix textures which are by default upside down in three.js
    // textures.normalMap.flipY=false
    // textures.colorSpace=THREE.SRGBColorSpace

    //it is not working , the callback is not being called
    //so
    const [normalMap,sampleMatCap]=(useTexture(["models/dog_normals.jpg","matcap/mat-2.png"]))
    .map(texture=>{
      texture.flipY=false
      texture.colorSpace=THREE.SRGBColorSpace
      return texture
    })


    const [branchMap,branchNormalMap]=(useTexture(["branches_diffuse.jpeg","branches_normals.jpeg"]))
    .map(texture=>{
      texture.flipY=true
      texture.colorSpace=THREE.SRGBColorSpace
      return texture
    })



    const dogMaterial=new THREE.MeshMatcapMaterial({
      normalMap:normalMap,
      matcap:sampleMatCap
    })

      const branchMaterial= new THREE.MeshMatcapMaterial({
         normalMap: branchNormalMap,
        map: branchMap
      })




    model.scene.traverse((child)=>{//traverse goes through all the children of the model
   // console.log("traversing",child)
    //console.log(child.name)
    if(child.name.includes("DOG")){
      //console.log(child.name)
      child.material=dogMaterial
    }
    else
    {
      child.material=branchMaterial
    }

    })

  return (

<>
{/* <mesh>
    <meshBasicMaterial color={0x00FF00}/>
    <boxGeometry args={[1,1,1]}/>
</mesh> */}

<primitive object={model.scene} position={[0.25,-0.55,0]} rotation={[0,Math.PI/3.9,0]}/>
<directionalLight position={[0,5,5]} color={0xFFFFFF} intensity={10}/>
 {/* <OrbitControls/> */}
 {/*through OrbitControls we can rotate the camera around the object*/}
</>



    
  )
}
    

export default Dog