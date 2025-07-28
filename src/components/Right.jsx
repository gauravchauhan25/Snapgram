import React from "react";
import { suggestions } from "../assets/suggestions";

export default function Right() {
    return(
        <>
            <div className="suggestions-container">
                  <div className="profile">
                        <div className="profile-photo">
                              <img src="https://i.pinimg.com/564x/d8/8d/41/d88d4171b97b8eba2b1382a09deb7dc8.jpg"
                                    alt="" />
                        </div>

                        <div className="username">
                              <h5 className="text-muted">__gauravchauhan_</h5>
                              <small>Gaurav Singh Chauhan</small>
                        </div>

                        <div className="switch-acc">
                              <a href="#" className="text-purple">Switch</a>
                        </div>
                  </div>

                  <h4 className="text-muted" style={{ marginBottom: '1rem' }}>Suggested for you</h4>

                  {suggestions.map((suggestion) => (
                  <div className="suggestions" key={suggestion.id}>
                        <div className="profile-photo">
                              <img src={suggestion.imageUrl}
                                    alt="" />
                        </div>

                        <div className="suggestion-body">
                              <p><b>{suggestion.username}</b></p>
                              <small className="text-muted">Followed by {suggestion.followedBy} + 8 more</small>
                        </div>

                        <div className="follow-btn">
                              <a href="#" className="text-purple">Follow</a>
                        </div>
                         
                  </div>
                ))}
                  
            </div>
        </>
    );
}