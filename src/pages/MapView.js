import React, {useState} from 'react';
import KakaoMap from "../components/KakaoMap";
import {FaMapMarkerAlt} from "react-icons/fa";
import {styled} from "styled-components";
import {useNavigate} from "react-router-dom";
import ToSpot from "../dataSet/ToSpotData";
import {LuCircleDot} from "react-icons/lu"
import ToSpotData from "../dataSet/ToSpotData";

const ToSpotBtn = styled.div`
  transition: transform 0.5s ease;
  transform: translateY(${({translateY}) => translateY + "vh"});
  position: absolute;
  font-family: 'Prompt', sans-serif;
  top: 8vh;
  right: 3vh;
  z-index: 2;
  * {
    box-sizing: border-box;
  }
  .hot-spot {
    width: 20vh;
    display: flex;
    align-items: center;
  }
  .to-timeline {
    width: 13.5vh;
    height: 4.5vh;
    display: flex;
    background-color: #3AACFF;
    color: #caf0f8;
    z-index: 2;
    text-align: center;
    line-height: 1.8;
    padding: .3vh 2vh;
    border-radius: 4.5vh;
    margin: 0 auto;
    border: 2px solid #fff;
  }

  .to-spot {
    width: 4.5vh;
    height: 4.5vh;
    border-radius: 4.5vh;
    background-color: white;
    padding: .7vh .8vh;
    margin: 0 auto;
  }
  .btn-main:hover {
    color: #ffffff;
    cursor: pointer;
  }
  .btn-sub:hover {
    color: #ffffff;
    cursor: pointer;
  }
  .to-spot:hover {
    color: #f24e1e;
  }
  .to-spot:active {
    background-color: rgb(0, 0, 0, 0);
  }

  .more {
    background-color: #d9d9d9;
    color: #000;
  }
  .marker {
    color: #282c34;
  }
  .marker:hover {
    color: #f24e1e;
  }
`;

const Converter = styled.button`
  position: absolute;
  font-family: 'Prompt', sans-serif;
  bottom: 20px;
  right: 30px;
  z-index: 2;
  width: 50px;
  height: 50px;
  border-radius: 50px;
  border: 1px solid rgb(0,0,0, 30);
  opacity: 70%;
  padding: 8.5px 0;
  outline: none;
  &:hover {
    opacity: 90%;
  }
  &:active {
    opacity: 90%;
    background-color: #d9d9d9;
  }
  .icon:hover {
    color: #f24e1e;
  }
`;


const MapView = () => {
  const navigate = useNavigate();
  // 핫 플레이스 이름, 경도, 위도 데이터를 저장한 배열
  const place = ToSpot.getPlace();
  // toSpot 버튼 아이템 표시 여부 ex) 0 = false, 1 = true
  const [isToSpotBtnState, setIsToSpotBtnState] = useState(0);
  // viewSet 표시 여부 ex) 0 = 혼잡도, 1 = 도트
  const [viewSet, setViewSet] = useState(0);
  const btnToSpotMoreView = () => { // onClick 으로 표시 여부 핸들링
    if (isToSpotBtnState === 0) setIsToSpotBtnState(1);
    else setIsToSpotBtnState(0);
  }
  const ToTimeLine = (location) => {
    console.log(location)
    navigate("/timeline", {
      state: {
        loc: location
      }
    });
  }
  const [latitude, setLatitude] = useState(37.4923615);
  const [longitude, setLongitude]= useState(127.0292881);
  const [location, setLocation] = useState("");
  const toSpotFocus = (lat, lng, location) => {
    console.log(lat + "/" + lng + "/" + location);
    setLongitude(lng);
    setLatitude(lat);
    setLocation(location);
  }

  // 맵에 표시할 모드를 변환하는 함수
  const convertViewSet = () => {
    if (viewSet === 0) setViewSet(1);
    else setViewSet(0);
  }

  const mapData = ToSpotData.setMapData(latitude, longitude, location);

  return (
    <>
      {/*카카오맵을 렌더링하는 컴포넌트*/}
      <KakaoMap MapData={mapData} ViewSet={viewSet}/>

      {/*place 에 저장된 배열만큼 map 함수로 바로가기 버튼 생성*/}
      {place.map(p => (
        <ToSpotBtn translateY={(p.num * 6 * isToSpotBtnState)}>
          <div className={"hot-spot"}>
            <div className="to-spot item" onClick={() => toSpotFocus(p.lat, p.lng, p.location)}>
              <FaMapMarkerAlt className="marker" size={25}/>
            </div>
            <div className="btn-sub to-timeline" onClick={()=>ToTimeLine(p.location)}>{p.name}</div>
          </div>
        </ToSpotBtn>
      ))}
      {/*바로가기 버튼을 보여주는 상위 버튼, timeline 문구를 클릭하면 검색값을 비운 채로 타임라인으로 이동*/}
      <ToSpotBtn>
        <div className="hot-spot">
          <div className="to-spot main" onClick={() => btnToSpotMoreView()} style={{marginRight: "3px"}}>
            <FaMapMarkerAlt className="marker" size={25}/>
          </div>
          <div className="btn-main to-timeline more" onClick={()=>ToTimeLine('')}>TimeLine</div>
        </div>
      </ToSpotBtn>

      {/* 맵에 보이는 모드를 전환 시켜줌*/}
      <Converter onClick={()=>convertViewSet()}>
        {viewSet === 0 ?
          <LuCircleDot className="icon" size={30}/>
          :
          <FaMapMarkerAlt className="icon" size={30}/>
        }

      </Converter>
    </>
  );
}

export default MapView;