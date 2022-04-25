import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./style.scss";

const DescriptionCard = () => {
  return (
    <>
      <div className='main-skeleton'>
        <SkeletonTheme color='#F2F2F2' highlightColor='#F2F2F2'>
          <p>
            <Skeleton count={6} />
          </p>
        </SkeletonTheme>
      </div>
    </>
  );
};

export default DescriptionCard;
