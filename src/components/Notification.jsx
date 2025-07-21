import React, { useEffect } from "react";
import { notifications } from "../sources/notification";

export default function Notification() {
  useEffect(() => {
    document.title = "Notification";
  }, []);

  return (
    <>
      <h3>Notifications</h3>
      <div className="notification-container">
        <div className="request">
          <div className="profile-photo">
            <img
              src="https://i.pinimg.com/236x/dd/86/b6/dd86b635382fd8047919b6c32188b096.jpg"
              alt=""
            />
          </div>

          <div className="notification-body">
            <p>
              <b>Emma Watson </b> wants to follow you.
            </p>
            <small className="text-muted">5 minutes ago</small>
          </div>

          <div className="req-accept">
            <button className="btn btn-primary">Accept</button>
          </div>

          <div className="req-accept">
            <button className="btn btn-secondary">Decline</button>
          </div>
        </div>

        <div className="request">
          <div className="profile-photo">
            <img
              src="https://i.pinimg.com/236x/05/7c/06/057c06543250d3a184f94096111528ce.jpg"
              alt=""
              loading="lazy"
            />
          </div>

          <div className="notification-body">
            <p>
              <b>Rosamund Pike </b> wants to follow you.
            </p>
            <small className="text-muted">2 Hours ago</small>
          </div>

          <div className="req-accept">
            <button className="btn btn-primary">Accept</button>
          </div>

          <div className="req-accept">
            <button className="btn btn-secondary">Decline</button>
          </div>
        </div>

        {notifications.map((notification, id) => (
          <div className="request" key={notification.id}>
            <div className="profile-photo">
              <img src={notification.imgUrl} alt="" loading="lazy" />
            </div>

            <div className="notification-body">
              <p>
                <b>{notification.username} </b>
                {notification.task}
              </p>
              <small className="text-muted">{notification.duration}</small>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
