import React, {useEffect, useMemo, useState} from 'react';
import { CustomOverlayMap, Map, MapMarker, MarkerClusterer, useMap } from "react-kakao-maps-sdk";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ToSpotData from "../dataSet/ToSpotData";
import * as ToSpot from "../components/ToSpotComponent";
import { LuCircleDot } from "react-icons/lu";
import MyFlowApi from "../api/MyFlowApi";
import ForumData from '../utils/ForumData';
import styled from 'styled-components';

const Maker = styled.div`
  display:flex;
  justify-content: center;
  align-items:center;
  flex-direction: column;
  font-size:10px;
  width: 200px;
  height: 300px;
  background-color:white;
  border-radius: 15px;

    .img{
      height: 70%;
      width: 100%;
      border-radius: 15px 15px 0 0;
    }
    .title{
      display:flex;
      justify-content: center;
      align-items:center;
      height: 30%;
      width: 100%;
      font-size: 10px;
      flex-wrap: wrap;
      text-overflow: ellipsis;
      font-weight: bold;
    }  
`


const MapView = React.memo((props) => {
  const navigate = useNavigate();
  const [loc, setLoc] = useState("");
  const [lat, setLat] = useState(37.4923615);
  const [lng, setLng] = useState(127.0292881);
  const [flow, setFlow] = useState([]);
  const [forumData,setForumData] = useState([]);

   // 축제 데이터 가져오기 
   useEffect(() => {
    const start_idx = 1;
    const end_idx = 220;
    const type = " ";
    const title = " ";

    ForumData(start_idx, end_idx, type, title).then(data => {
      setForumData(data);
      console.log(data);
    }).catch(error => {
      console.error("Error fetching forum data:", error);
    });
  }, []);


  // 날짜 차이 계산
  const calDate = (start_date) => {
    const start_date_obj = new Date(start_date);
    const current_date_obj = new Date();
    const difference_in_time =  start_date_obj - current_date_obj ;
    const difference_in_days = difference_in_time / (1000 * 3600 * 24);
    return Math.floor(difference_in_days);
}




  const dataInit = async (token) => {
    let res = await MyFlowApi.allFlow(token);
    if (res.status===200) {
      console.log(res.status);
      let user = await res.data.map(i => ({
        name: i.customer.nickName,
        img: i.image,
        lat: i.lat,
        lng: i.lng,
        loc: i.place,
        time: i.joinDate,
        content: i.content,
        view: i.view
      }));
      let userData =  await user.map(i => ({
        content: ToSpotData.setOverlay(i),
        lat: i.lat,
        lng: i.lng
      }));
      await setFlow(userData);
      console.log(userData);
    }
  };

  const place = ToSpotData.getPlace();
  const [isToSpotBtnState, setIsToSpotBtnState] = useState(0);

  const btnToSpotMoreView = () => {
    setIsToSpotBtnState(prevState => (prevState === 0 ? 1 : 0));
  };

  const ToTimeLine = (location) => {
    console.log(location);
    navigate("/flow", {
      state: {
        loc: location
      }
    });
  };

  const toSpotFocus = (latitude, longitude, location) => {
    console.log(lat + "/" + lng + "/" + loc);
    setLat(latitude);
    setLng(longitude);
    setLoc(location);
  };

  const [viewSet, setViewSet] = useState(0);

  const convertViewSet = () => {
    setViewSet(prevState => (prevState === 0 ? 1 : 0));
  };

  const EventMarkerContainer = React.memo(({ lat, lng, content }) => {
    const map = useMap();
    const [isVisible, setIsVisible] = useState(false);

    const markerImg = "https://firebasestorage.googleapis.com/v0/b/spotflow-5475a.appspot.com/o/images%2Ffree-icon-location-pin-8637632%20(1).png?alt=media&token=92a76f40-a6c7-45c9-809f-5d320b9d844f";
    const soonImg = "https://firebasestorage.googleapis.com/v0/b/spotflow-5475a.appspot.com/o/images%2Ffree-icon-location-10797038.png?alt=media&token=e0965f50-abc4-40b0-a7eb-684052328586";
    return (
      <>
        
        <div style={{display:"flex",alignItems:"center",justifyContent:"center", color:"white" ,borderRadius:"15px",backgroundColor:"#35B1E8",width:"100px",height:"30px",left:"10%",top:"60px",position:"absolute", zIndex:"100"}}>서울 축제</div>
        <MapMarker
          position={{
            lat: lat,
            lng: lng
          }}
          image={{
            src: calDate(content.STRTDATE) < 3 ?   soonImg : markerImg, // 마커이미지의 주소입니다
            size: {
              width: 45,
              height: 50,
            }, // 마커이미지의 크기입니다
            options: {
              offset: {
                x: 27,
                y: 69,
              }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
            },
          }}
          title={content.TITLE}
          onClick={(marker) => {
            map.panTo(marker.getPosition());
            setIsVisible(prevState => !prevState);
          }}
        >
        </MapMarker>
        
        {isVisible &&
          <CustomOverlayMap position={{
            lat: content.LOT,
            lng: content.LAT,
          }}>
          <Maker onClick={()=>{setIsVisible(false)}}>
            <img src={`${content.MAIN_IMG}`} className='img'></img>
            <p>{`${content.DATE}`}</p>
            <p>{`${content.PLACE}`}</p>
            <div className='title'>{content.TITLE}</div>
          </Maker>
          </CustomOverlayMap>
        }

      </>
    );
  });



  useEffect(() => {
    const token = localStorage.getItem('authToken');
    dataInit(token);
    console.log(flow);
  }, [props, viewSet]);

  return (
    <ToSpot.Container>
      <Map
        center={{
          lat: lat,
          lng: lng,
        }}
        style={{
          width: "100%",
          height: "100vh",
          position: "relative"
        }}
        level={3}
      >
        {viewSet === 0 ? (
          <MarkerClusterer
            averageCenter={true}
            minLevel={1}
            disableClickZoom={true}
          >
            {flow.map((pos,idx) => (
              <MapMarker
                key={`${pos.lat}-${pos.lng}+${idx}`}
                position={{
                  lat: pos.lat,
                  lng: pos.lng,
                }}
              />
            ))}
          </MarkerClusterer>
        ) : (
            forumData.map((value,idx) => (
              
              <EventMarkerContainer
               key={`EventMarkerContainer-${value.LAT}-${value.LOT}-${idx}`}
                lat={parseFloat(value.LOT)}
                lng={parseFloat(value.LAT)}
                content={value}
                
                

              />
            ))
          )}

        {/*{place.map(p => (*/}
        {/*  <ToSpot.Btn translateY={(p.num * 6 * isToSpotBtnState)}>*/}
        {/*    <div className={"hot-spot"}>*/}
        {/*      <div className="to-spot item" onClick={() => toSpotFocus(p.lat, p.lng, p.location)}>*/}
        {/*        <FaMapMarkerAlt className="marker" size={25} />*/}
        {/*      </div>*/}
        {/*      <div className="btn-sub to-timeline" onClick={() => ToTimeLine(p.location)}>{p.name}</div>*/}
        {/*    </div>*/}
        {/*  </ToSpot.Btn>*/}
        {/*))}*/}

        {/*<ToSpot.Btn>*/}
        {/*  <div className="hot-spot">*/}
        {/*    <div className="to-spot main" onClick={() => btnToSpotMoreView()} style={{ marginRight: "3px" }}>*/}
        {/*      <FaMapMarkerAlt className="marker" size={25} />*/}
        {/*    </div>*/}
        {/*    <div className="btn-main to-timeline more" onClick={() => ToTimeLine('')}>TimeLine</div>*/}
        {/*  </div>*/}
        {/*</ToSpot.Btn>*/}

        <ToSpot.Converter onClick={() => convertViewSet()}>
          {viewSet === 0 ?
            <LuCircleDot className="icon" size={30} /> :
            <FaMapMarkerAlt className="icon" size={30} />
          }
        </ToSpot.Converter>

      </Map>
    </ToSpot.Container>

  );
});

export default MapView;

