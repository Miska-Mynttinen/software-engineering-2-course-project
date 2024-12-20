import { Stream } from "stream";
import { json } from "stream/consumers";
import { LoginRequest, LoginResponse } from "../redux/states/apiState";

// const vmPath = `dapm1.compute.dtu.dk:5000`
const vmPath = `se2-f.compute.dtu.dk:5000`
const localPath = `localhost:5000`

let path = localPath

let isVM = false;

// isVM = true;

if (isVM) {
    path = vmPath
}

export async function fetchPipelineExecutionStatus(orgId: string, repId: string, pipeId: string, exeId: string) {
    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories/${repId}/pipelines/${pipeId}/executions/${exeId}/status`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure the token is included
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error fetching execution status:', error);
        throw error;
    }
}
export async function fetchStatus(ticket: string) {

    try {
        const response = await fetch(`http://` + path + `/status/${ticket}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        return error;
    }
}
export async function fetchFile(ticket: string) {

    try {
        const response = await fetch(`http://` + path + `/status/${ticket}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return response;
    } catch (error) {
        console.error('Error fetching status:', error);
        return error;
    }
}
export async function fetchOrganisations() {
    try {
        const response = await fetch(`http://` + path + `/organizations`);
        if (!response.ok) {
            throw new Error('Fetching orgs, Network response was not ok');
        }
        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('Fetching orgs, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}
export async function fetchOrganisation(orgId: string) {
    try {
        const response = await fetch(`http://` + path + `/organizations/${orgId}`);
        if (!response.ok) {
            throw new Error('Fetching org, Network response was not ok');
        }
        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('Fetching org, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}
export async function fetchOrganisationRepositories(orgId: string) {
    try {
        // Retrieve the JWT token from localStorage
        const token = localStorage.getItem('token');
        console.log("Auth:",token)
        if (!token) {
            throw new Error('No authentication token found. Please log in.');
        }

        // Make the initial request to fetch repositories
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Fecthing reps, Network response was not ok');
        }
        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('Fecthing reps, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}
export async function fetchRepository(orgId: string, repId: string) {
    try {
        const response = await fetch(`http://` + path + `/organizations/${orgId}/repositories/${repId}`);
        if (!response.ok) {
            throw new Error('Fecthing rep, Network response was not ok');
        }
        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };
        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('Fecthing rep, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}
export async function fetchRepositoryResources(orgId: string, repId: string) {
    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories/${repId}/resources`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in header
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Fetching resources, Network response was not ok');
        }

        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('Fetching resources, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}
export async function fetchResource(orgId: string, repId: string, resId: string) {
    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories/${repId}/resources/${resId}`);
        if (!response.ok) {
            throw new Error('Fetching resource, Network response was not ok');
        }
        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('Fetching resource, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function fetchRepositoryPipelines(orgId: string, repId: string) {
    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories/${repId}/pipelines`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in header
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('fetching pipelines, Network response was not ok');
        }
        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('fetching pipelines, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function fetchPipeline(orgId: string, repId: string, pipId: string) {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`); // Include the token if authentication is required.

    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories/${repId}/pipelines/${pipId}`, {
            method: 'GET',
            headers: headers,
        });

        if (!response.ok) {
            throw new Error('Fetching pipeline, Network response was not ok');
        }

        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchPipeline
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('Fetching pipeline, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function fetchOrganizationUsers(orgId: string) {
    try {
        const response = await fetch(`http://` + path + `/organizations/${orgId}/users`);
        if (!response.ok) {
            throw new Error('Fecthing reps, Network response was not ok');
        }
        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisationsUsers
        const users = await getData(jsonData.ticketId);
        return users;
    } catch (error) {
        console.error('Fecthing reps, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function fetchOrganizationUserGroups(orgId: string) {
    try {
        const response = await fetch(`http://` + path + `/organizations/${orgId}/userGroups`);
        if (!response.ok) {
            throw new Error('Fecthing reps, Network response was not ok');
        }
        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisationsUsers
        const userGroups = await getData(jsonData.ticketId);
        return userGroups;
    } catch (error) {
        console.error('Fecthing reps, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function putRepository(orgId: string, repositoryName: string) {
    // Retrieve the JWT token from local storage
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found. Please log in.');
    }

    // Set headers for the request
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${token}`); // Add JWT token to Authorization header

    try {
        // Send POST request to create the repository
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ name: repositoryName }),
        });

        // Check if the response status is not OK (non-2xx)
        if (!response.ok) {
            throw new Error(`Failed to create repository. Status: ${response.status}`);
        }

        // Parse the response JSON
        const jsonData = await response.json();

        // Recursive function to fetch the data based on ticket ID
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    // Fetch the status of the operation using ticketId
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data; // Return the data when the operation is successful
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    // Retry if an error occurs
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached while fetching repository status.');
                    }
                }
            }
            throw new Error('Failed to fetch repository data after retries.');
        };

        // Call getData with the ticketId obtained from the response
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('Error creating repository:', error);
        throw error; // Propagate the error to the caller
    }
}


export async function putResource(orgId: string, repId: string, formData: FormData) {
    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories/${repId}/resources`, {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in header
            },
        });

        if (!response.ok) {
            throw new Error('put res, Network response was not ok');
        }

        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('put res, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}
export async function putPipeline(orgId: string, repId: string, pipelineData: any) {
    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories/${repId}/pipelines`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(pipelineData)
        });

        if (!response.ok) {
            throw new Error('put pipeline, Network response was not ok');
        }

        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 1000;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data.result.itemIds.pipelineId as string;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('put pipeline, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function putExecution(orgId: string, repId: string, pipeId: string) {
    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories/${repId}/pipelines/${pipeId}/executions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error('put execution, Network response was not ok');
        }

        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return { ...data.result, ticketId } as object;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to post execution');
        };

        // Call getData function with the ticketId obtained from putExecution
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('put execution, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function putCommandStart(orgId: string, repId: string, pipeId: string, exeId:string) {
    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories/${repId}/pipelines/${pipeId}/executions/${exeId}/commands/start`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (!response.ok) {
            throw new Error('put command start, Network response was not ok');
        }

        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to command start');
        };

        // Call getData function with the ticketId obtained from putExecution
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('put command start, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function putOperator(orgId: string, repId: string, formData: FormData) {
    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/repositories/${repId}/resources/operators`, {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token in header
            },
        });

        if (!response.ok) {
            throw new Error('put res, Network response was not ok');
        }

        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('put res, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function loginUser(loginRequest: LoginRequest) {
    console.log("Login Request:", loginRequest);
  
    try {
      // Prepare the request options for fetch
      const response = await fetch(`http://${path}/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest), // Convert the request body to a JSON string
      });
  
      if (!response.ok) {
        // Handle non-2xx status codes
        throw new Error(`Login failed with status: ${response.status}`);
      }
  
      // Parse the response JSON
      const data: LoginResponse = await response.json();
      console.log("Data: ",data)
      console.log("token: ",data.token)
      console.log("userType: ",data.userType)
      // Store the token in localStorage
      localStorage.setItem('username', loginRequest.username);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userType', data.userType);
      return data;
    } catch (error) {
      console.error('Login error', error);
      throw error;
    }
  }
  
export async function logoutUser() {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No token found in localStorage.");
    }

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    try {
        const response = await fetch(`http://${path}/authentication/logout`, {
            method: "DELETE",
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Logout failed: ${errorText}`);
        }

        // Remove the token from localStorage
        localStorage.removeItem("token");

        return response.status;
    } catch (error) {
        console.error("Error during logout:", error);
        throw error;
    }
}
export async function checkToken() {
    const token = localStorage.getItem("token");

    if (!token) {
        return false; // Token does not exist in localStorage
    }

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);

    try {
        const response = await fetch(`http://${path}/authentication/checkToken`, {
            method: "GET",
            headers: headers
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Token validation failed:", errorText);
            return false; // Token is invalid or not related to the current user
        }

        return true; // Token is valid
    } catch (error) {
        console.error("Error checking token:", error);
        return false;
    }
}

export async function putUser(orgId: string, userData: { [key: string]: any }) {
    const headers = new Headers()
    headers.append("accept", "application/json")
    headers.append("Content-Type", "application/json")
    
    try {
        const response = await fetch(`http://${path}/organizations/${orgId}/users`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(userData) // Send the JSON object directly
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Network response was not ok: ${errorText}`);
            throw new Error(`put res, Network response was not ok: ${errorText}`);
        }

        const jsonData = await response.json();

        // Fetch additional data recursively (your existing logic)
        return jsonData; // Return the response data as needed
    } catch (error) {
        console.error('put res, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function updateUser(orgId: string, userId: string, userGroups: string[]) {
    const headers = new Headers();
    headers.append("accept", "application/json");
    headers.append("Content-Type", "application/json");
    
    try {
        // Send a PUT request to update user details
        const response = await fetch(`http://${path}/organizations/${orgId}/users/${userId}`, {
            method: "PUT",
            headers: headers,
            body: JSON.stringify(userGroups) // Send the JSON object with updated user data
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Network response was not ok: ${errorText}`);
            throw new Error(`updateUser, Network response was not ok: ${errorText}`);
        }

        const jsonData = await response.json();
        return jsonData; // Return the updated user data as needed
    } catch (error) {
        console.error('updateUser, Error updating data:', error);
        throw error; // Propagate error to the caller
    }
}


export async function putUserGroup(orgId: string, userGroup: string) {
    const headers = new Headers()
    headers.append("accept", "application/json")
    headers.append("Content-Type", "application/json")
    
    try {
        const response = await fetch(`http://` + path + `/organizations/${orgId}/userGroups`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify({ name: userGroup })
        });

        if (!response.ok) {
            throw new Error('put rep, Network response was not ok');
        }

        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const data = await fetchStatus(ticketId);
                    if (data.status) {
                        return data;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('put rep, Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function PostNewPeer(domainName: string) {
    try {
        const formData = new FormData();
        formData.append('targetPeerDomain', domainName);

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        const response = await fetch(`http://` + path +`/system/collab-handshake`, {
            method: "POST",
            body: JSON.stringify({targetPeerDomain: domainName}),
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Network response was not ok (PostNewPeer)');
        }

        const jsonData = await response.json();

        // Fetch additional data recursively
        var retryNumber = 0;
        const getData = async (ticketId: string): Promise<any> => {
            try {
                const data = await fetchStatus(ticketId);
                if (!data.status && retryNumber < 10) {
                    retryNumber++;
                    return await getData(ticketId); // Recursive call
                } else {
                    return data; // Return data once condition is met
                }
            } catch (error) {
                throw error; // Propagate error to the outer catch block
            }
        };

        // Call getData function with the ticketId obtained from fetchOrganisations
        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Propagate error to the caller
    }
}

export async function downloadResource(organizationId: string, repositoryId: string, resourceId: string) {
    try {
        const headers = new Headers();
        headers.append("accept", "application/json");
        headers.append("Content-Type", "application/json");
        headers.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        const response = await fetch(`http://${path}/organizations/${organizationId}/repositories/${repositoryId}/resources/${resourceId}/file`,{
            method: "get",
            headers: headers,
        });
        if (!response.ok) {
            throw new Error('Fetching resource, Network response was not ok');
        }
        const jsonData = await response.json();

        // Fetch additional data recursively
        const getData = async (ticketId: string): Promise<any> => {
            const maxRetries = 10;
            const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            for (let retries = 0; retries < maxRetries; retries++) {
                try {
                    const response = await fetchFile(ticketId) as any;
                    if (response.ok) {
                        await delay(1000); // Wait before returning the response
                        return response;
                    }
                    await delay(1000); // Wait for 1 second before retrying
                } catch (error) {
                    if (retries === maxRetries - 1) {
                        throw new Error('Max retries reached');
                    }
                }
            }
            throw new Error('Failed to fetch data');
        };

        return await getData(jsonData.ticketId);
    } catch (error) {
        console.error('Error fetching resource:', error);
        throw error; // Propagate error to the caller
    }
}