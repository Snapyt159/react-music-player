import { useEffect, useState, useRef } from "react";
import useSound from "use-sound"; //este es para manejar el sonido
import song from "../assets/canciones/heavy.mp3"; //llamar la cancion
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // aqui estan los iconos de los botones de play y pausa
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // estos son los iconos de los botones antes y despues
import { IconContext } from "react-icons"; // este es para personalizar los iconos
import {track} from "../component/track";
import {
  IoMdVolumeHigh,
  IoMdVolumeOff,
  IoMdVolumeLow,
} from 'react-icons/io';

export default function Player() {

  //declaracion de variables a usar
  const [isPlaying, setIsPlaying] = useState(false); // este muestra los iconos de play y pause segun el estado del reproductor
  const [time, setTime] = useState({
    min: "",
    sec: ""
  });

  const [trackIndex, setTrackIndex] = useState(0);
  const [currenTrack, setCurrenTrack] = useState(track[trackIndex]); 

  /* const [volumen, setVolumen] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false); */

  const [currTime, setCurrTime] = useState({
    min: "",
    sec: ""
  });

  const [seconds, setSeconds] = useState();

  //aqui inicia donde se almacena la cancion
  const [play, { pause, audioRef, duration, sound, stop }] = useSound(currenTrack.src);  //esta parte llama la cancion
  


  useEffect(() => { // este codigo muestra como la duracion se proporciona en milisegundos, convertidos a minutos y segundos
    if (duration) {
      const sec = duration / 1000;
      const min = Math.floor(sec / 60);
      const secRemain = Math.floor(sec % 60);
      setTime({
        min: min,
        sec: secRemain
      });
    }
  }, [isPlaying]);
  
  useEffect(() => { // este es para mostrar la linea que muestra cuaando se esta reproduciendo la cancion
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([]));
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        setCurrTime({
          min,
          sec
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  //aqui ira para darle a la cancion siguiente

  const handleNext = () => {
    stop();
    setIsPlaying(false);
    if (trackIndex >= track.length - 1){
      setTrackIndex(0);
      setCurrenTrack(track[0]); 

    } else{
      setTrackIndex((prev) => prev + 1);
      setCurrenTrack(track[trackIndex + 1]);
    }
   
  };

  // aqui empieza para la cancion previa
  const handlePrevious = () => { 
    stop();
    setIsPlaying(false);
    if (trackIndex === 0){
      let lastTrackIndex = track.length - 1;
      setTrackIndex(lastTrackIndex);
      setCurrenTrack(track[lastTrackIndex]);
    } else{
      setTrackIndex((prev) => prev - 1);
      setCurrenTrack(track[trackIndex - 1]);
    }
    
  }; 


  const playingButton = () => { // este es el codigo para dar funcion a los botones pausar y reproducir
    if (isPlaying) {
      pause(); // este es para pausar el audio
      setIsPlaying(false);
    } else {
      play(); // esto es para reproducir el audio
      setIsPlaying(true);
    }
  }; // aqui termina

/* 
  useEffect(() => {
    if (audioRef) {
      audioRef.current.volumen = volumen / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volumen,audioRef, muteVolume]); */

  return ( // este es para mostar el reproductor de musica UI
    <div className="component">
      <h2>Playing now</h2> 
      <img className="musicCover" src= {currenTrack.thumbnail} />
      <div>
        <h3 className="title">{currenTrack.title}</h3>
        <p className="subTitle">{currenTrack.author}</p>
      </div>
      <div>
        <div className="time">
          <p>
            {currTime.min}:{currTime.sec}
          </p>
          <p>
            {time.min}:{time.sec}
          </p>
        </div>
        <input     //este es para mostrar la barra de tiempo
          type="range"
          min="0"
          max={duration / 1000}
          default="0"
          value={seconds}
          className="timeline"
          onChange={(e) => {
            sound.seek([e.target.value]);        //aqui termina
          }}
        />        
      </div>
      {<div>          
        <button className="playButton" onClick={handlePrevious}>     
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>     
            <BiSkipPrevious />     
          </IconContext.Provider>     
        </button>    
        {!isPlaying ? (
          <button className="playbutton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPlayCircle />
            </IconContext.Provider>
          </button>
        ) : (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPauseCircle />
            </IconContext.Provider>
          </button>
        )}
        <button className="playButton" onClick={handleNext}>
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipNext />
          </IconContext.Provider>
        </button>
      </div>}
      <div className="letra">
        {currenTrack.lyrics}
      </div>
    </div>
    
  );
} // aqui termina el codigo para mostrar el reproductor de musica UI
