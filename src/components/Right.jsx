import React from "react";
import { suggestions } from "../sources/suggestions";

export default function Right() {
    return(
        <>
            <div class="suggestions-container">
                  <div class="profile">
                        <div class="profile-photo">
                              <img src="https://i.pinimg.com/564x/d8/8d/41/d88d4171b97b8eba2b1382a09deb7dc8.jpg"
                                    alt="" />
                        </div>

                        <div class="username">
                              <h5 class="text-muted">__gauravchauhan_</h5>
                              <small>Gaurav Singh Chauhan</small>
                        </div>

                        <div class="switch-acc">
                              <a href="#" class="text-purple">Switch</a>
                        </div>
                  </div>

                  <h4 class="text-muted" style={{ marginBottom: '1rem' }}>Suggested for you</h4>

                  {suggestions.map((suggestion) => (
                  <div class="suggestions" key={suggestion.id}>
                        <div class="profile-photo">
                              <img src={suggestion.imageUrl}
                                    alt="" />
                        </div>

                        <div class="suggestion-body">
                              <p><b>{suggestion.username}</b></p>
                              <small class="text-muted">Followed by {suggestion.followedBy} + 8 more</small>
                        </div>

                        <div class="follow-btn">
                              <a href="#" class="text-purple">Follow</a>
                        </div>
                         
                  </div>
                ))}
                  
            </div>
        </>
    );
}