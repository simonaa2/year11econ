// 2026 World Cup Synergy Standings Dashboard Application
document.addEventListener('DOMContentLoaded', () => {
    let teamsData = [];
    let selectedTeam = null;

    // DOM Elements
    const searchInput = document.getElementById('team-search');
    const groupSelect = document.getElementById('filter-group-select');
    const profileSelect = document.getElementById('filter-profile-select');
    const statusSelect = document.getElementById('filter-status-select');
    const sortSelect = document.getElementById('sort-select');
    const teamsList = document.getElementById('teams-list');
    const detailPanel = document.getElementById('detail-panel');
    const squadCountBadge = document.getElementById('squad-count');

    // Tactical Lineup Database for Case Studies and Profiles
    const tacticalLineups = {
        "Mexico": [
            { name: "Raúl Rangel", pos: "GK", type: "domestic", x: 50, y: 88 },
            { name: "Johan Vásquez", pos: "LCB", type: "overseas", x: 35, y: 73 },
            { name: "César Montes", pos: "RCB", type: "overseas", x: 65, y: 73 },
            { name: "Gerardo Arteaga", pos: "LB", type: "overseas", x: 15, y: 68 },
            { name: "Jorge Sánchez", pos: "RB", type: "overseas", x: 85, y: 68 },
            { name: "Edson Álvarez", pos: "DM", type: "overseas", x: 50, y: 55 },
            { name: "Luis Romo", pos: "LCM", type: "domestic", x: 30, y: 44 },
            { name: "Brian Gutiérrez", pos: "RCM", type: "domestic", x: 70, y: 44 },
            { name: "Roberto Alvarado", pos: "LW", type: "domestic", x: 20, y: 24 },
            { name: "César Huerta", pos: "RW", type: "overseas", x: 80, y: 24 },
            { name: "Santiago Giménez", pos: "ST", type: "overseas", x: 50, y: 14 }
        ],
        "Netherlands": [
            { name: "Bart Verbruggen", pos: "GK", type: "overseas", x: 50, y: 88 },
            { name: "Nathan Aké", pos: "LCB", type: "overseas", x: 35, y: 73 },
            { name: "Virgil van Dijk", pos: "CB", type: "overseas", x: 50, y: 76 },
            { name: "Jan Paul van Hecke", pos: "RCB", type: "overseas", x: 65, y: 73 },
            { name: "Denzel Dumfries", pos: "RWB", type: "overseas", x: 85, y: 65 },
            { name: "Ryan Gravenberch", pos: "LDM", type: "overseas", x: 38, y: 56 },
            { name: "Tijjani Reijnders", pos: "RDM", type: "overseas", x: 62, y: 56 },
            { name: "Quinten Timber", pos: "AM", type: "domestic", x: 50, y: 42 },
            { name: "Cody Gakpo", pos: "LW", type: "overseas", x: 20, y: 24 },
            { name: "Donyell Malen", pos: "RW", type: "overseas", x: 80, y: 24 },
            { name: "Noa Lang", pos: "ST", type: "domestic", x: 50, y: 14 }
        ],
        "Spain": [
            { name: "Unai Simón", pos: "GK", type: "domestic", x: 50, y: 88 },
            { name: "Pau Cubarsí", pos: "LCB", type: "domestic", x: 35, y: 73 },
            { name: "Dani Vivian", pos: "RCB", type: "domestic", x: 65, y: 73 },
            { name: "Alejandro Balde", pos: "LB", type: "domestic", x: 15, y: 68 },
            { name: "Dani Carvajal", pos: "RB", type: "domestic", x: 85, y: 68 },
            { name: "Rodri", pos: "DM", type: "overseas", x: 50, y: 55 },
            { name: "Pedri", pos: "LCM", type: "domestic", x: 30, y: 44 },
            { name: "Gavi", pos: "RCM", type: "domestic", x: 70, y: 44 },
            { name: "Nico Williams", pos: "LW", type: "domestic", x: 20, y: 24 },
            { name: "Lamine Yamal", pos: "RW", type: "domestic", x: 80, y: 24 },
            { name: "Alvaro Morata", pos: "ST", type: "overseas", x: 50, y: 14 }
        ],
        "South Africa": [
            { name: "Ronwen Williams", pos: "GK", type: "domestic", x: 50, y: 88 },
            { name: "Mothobi Mvala", pos: "LCB", type: "domestic", x: 35, y: 73 },
            { name: "Grant Kekana", pos: "RCB", type: "domestic", x: 65, y: 73 },
            { name: "Aubrey Modiba", pos: "LB", type: "domestic", x: 15, y: 68 },
            { name: "Khuliso Mudau", pos: "RB", type: "domestic", x: 85, y: 68 },
            { name: "Teboho Mokoena", pos: "LDM", type: "domestic", x: 38, y: 56 },
            { name: "Sphephelo Sithole", pos: "RDM", type: "overseas", x: 62, y: 56 },
            { name: "Themba Zwane", pos: "AM", type: "domestic", x: 50, y: 42 },
            { name: "Thapelo Morena", pos: "LW", type: "domestic", x: 20, y: 24 },
            { name: "Percy Tau", pos: "RW", type: "overseas", x: 80, y: 24 },
            { name: "Evidence Makgopa", pos: "ST", type: "domestic", x: 50, y: 14 }
        ],
        "Saudi Arabia": [
            { name: "Al-Owais", pos: "GK", type: "domestic", x: 50, y: 88 },
            { name: "Al-Bulayhi", pos: "LCB", type: "domestic", x: 35, y: 73 },
            { name: "Lajami", pos: "RCB", type: "domestic", x: 65, y: 73 },
            { name: "Al-Shahrani", pos: "LB", type: "domestic", x: 15, y: 68 },
            { name: "Abdulhamid", pos: "RB", type: "domestic", x: 85, y: 68 },
            { name: "Al-Khaibari", pos: "DM", type: "domestic", x: 50, y: 55 },
            { name: "Kanno", pos: "LCM", type: "domestic", x: 30, y: 44 },
            { name: "Al-Faraj", pos: "RCM", type: "domestic", x: 70, y: 44 },
            { name: "Al-Dawsari", pos: "LW", type: "domestic", x: 20, y: 24 },
            { name: "Al-Muwallad", pos: "RW", type: "domestic", x: 80, y: 24 },
            { name: "Al-Shehri", pos: "ST", type: "domestic", x: 50, y: 14 }
        ],
        "Canada": [
            { name: "Maxime Crépeau", pos: "GK", type: "overseas", x: 50, y: 88 },
            { name: "Derek Cornelius", pos: "LCB", type: "overseas", x: 35, y: 73 },
            { name: "Moïse Bombito", pos: "RCB", type: "overseas", x: 65, y: 73 },
            { name: "Alphonso Davies", pos: "LB", type: "overseas", x: 15, y: 68 },
            { name: "Alistair Johnston", pos: "RB", type: "overseas", x: 85, y: 68 },
            { name: "Stephen Eustáquio", pos: "LCM", type: "overseas", x: 35, y: 54 },
            { name: "Ismaël Koné", pos: "RCM", type: "overseas", x: 65, y: 54 },
            { name: "Liam Millar", pos: "LW", type: "overseas", x: 20, y: 34 },
            { name: "Tajon Buchanan", pos: "RW", type: "overseas", x: 80, y: 34 },
            { name: "Jonathan David", pos: "CF", type: "overseas", x: 40, y: 18 },
            { name: "Cyle Larin", pos: "ST", type: "overseas", x: 60, y: 18 }
        ]
    };

    // 1. Fetch JSON Data
    const loadTeamsData = async () => {
        try {
            const response = await fetch('wc_data.json');
            if (!response.ok) throw new Error("Failed to load dataset.");
            teamsData = await response.json();
            renderTeams();
            renderScatterPlot();
            // Automatically select Spain as the benchmark at start
            const initialSelection = teamsData.find(t => t.National_Team === "Spain") || teamsData[0];
            if (initialSelection) showTeamDetails(initialSelection);
        } catch (err) {
            console.error(err);
            teamsList.innerHTML = `
                <div class="no-selection glass-panel">
                    <svg style="color: var(--accent-coral)" class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                    <h3>Data Load Error</h3>
                    <p>Could not fetch the World Cup synergy records. Make sure the R data pipeline script has been executed.</p>
                </div>
            `;
        }
    };

    // 2. Render Teams List
    const renderTeams = () => {
        const query = searchInput.value.toLowerCase().trim();
        const selectedGroup = groupSelect.value;
        const selectedProfile = profileSelect.value;
        const selectedStatus = statusSelect.value;
        const [sortKey, sortOrder] = sortSelect.value.split('-');

        // Filtering
        let filtered = teamsData.filter(team => {
            const matchesQuery = team.National_Team.toLowerCase().includes(query);
            const matchesGroup = selectedGroup === 'all' || team.Group === selectedGroup;
            const matchesProfile = selectedProfile === 'all' || team.Core_Chemistry_Profile === selectedProfile;
            
            // Check status: Advanced contains "Advanced"
            const matchesStatus = selectedStatus === 'all' || 
                (selectedStatus === 'Advanced' && team.Group_Status.includes('Advanced')) ||
                (selectedStatus === 'Eliminated' && team.Group_Status.includes('Eliminated'));

            return matchesQuery && matchesGroup && matchesProfile && matchesStatus;
        });

        // Sorting
        filtered.sort((a, b) => {
            let valA = a[sortKey];
            let valB = b[sortKey];

            // Parse numbers where appropriate
            if (typeof valA === 'string' && !isNaN(Number(valA))) valA = Number(valA);
            if (typeof valB === 'string' && !isNaN(Number(valB))) valB = Number(valB);

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });

        // Update squad count badge
        squadCountBadge.textContent = `${filtered.length} Team${filtered.length !== 1 ? 's' : ''}`;
        
        // Update scatter plot filters
        updateScatterPlotFilters(filtered);

        if (filtered.length === 0) {
            teamsList.innerHTML = `
                <div class="loading-state">
                    <p>No squads found matching current filter rules.</p>
                </div>
            `;
            return;
        }

        teamsList.innerHTML = '';
        filtered.forEach((team, index) => {
            const isSelected = selectedTeam && selectedTeam.National_Team === team.National_Team;
            const card = document.createElement('div');
            card.className = `team-card glass-panel ${isSelected ? 'selected' : ''}`;
            card.id = `team-card-${team.National_Team.replace(/\s+/g, '-')}`;

            // Extract status type for color
            const isAdvanced = team.Group_Status.includes('Advanced');
            const statusClass = isAdvanced ? 'status-advanced' : 'status-eliminated';
            
            // Determine profile tag color type
            let profileClass = 'profile-scattered';
            if (team.Core_Chemistry_Profile === 'Domestic Club Blocks') profileClass = 'profile-blocks';
            else if (team.Core_Chemistry_Profile === 'Hybrid Core') profileClass = 'profile-hybrid';
            else if (team.Core_Chemistry_Profile === 'League Monopoly') profileClass = 'profile-monopoly';

            card.innerHTML = `
                <div class="team-rank">${index + 1}</div>
                <div class="team-group">${team.Group}</div>
                <div class="team-identity">
                    <div class="team-name">${team.National_Team}</div>
                    <div class="team-profile ${profileClass}">${team.Core_Chemistry_Profile}</div>
                </div>
                <div class="team-status ${statusClass}">${team.Group_Status.split(' ')[0]}</div>
                <div class="team-strategy-summary" title="${team.Primary_Synergy_Strategy}">${team.Primary_Synergy_Strategy}</div>
                <div class="team-synergy-rating">${team.Final_Synergy_Rating}</div>
            `;

            card.addEventListener('click', () => {
                // Remove previous selected state
                document.querySelectorAll('.team-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                showTeamDetails(team);
            });

            teamsList.appendChild(card);
        });
    };

    // 3. Render Team Details Page
    const showTeamDetails = (team) => {
        selectedTeam = team;
        
        // Highlight active dot in scatter plot
        document.querySelectorAll('.plot-dot').forEach(d => d.classList.remove('dot-selected'));
        const activeDot = document.getElementById(`plot-dot-${team.National_Team.replace(/\s+/g, '-')}`);
        if (activeDot) activeDot.classList.add('dot-selected');
        
        const template = document.getElementById('team-detail-template');
        const clone = template.content.cloneNode(true);

        // Fill static text content
        clone.querySelector('.team-group-val').textContent = team.Group;
        clone.querySelector('.team-name-val').textContent = team.National_Team;
        clone.querySelector('.strategy-val').textContent = team.Primary_Synergy_Strategy;
        clone.querySelector('.analysis-val').textContent = team.Real_World_Performance_Analysis;
        clone.querySelector('.pts-val').textContent = `${team.Group_Pts} Point${team.Group_Pts !== 1 ? 's' : ''}`;
        
        // Profiles styles
        const profileBadge = clone.querySelector('.detail-profile-val');
        profileBadge.textContent = team.Core_Chemistry_Profile;
        
        let profileColor = '#f87171'; // scattered
        let profileBg = 'rgba(248, 113, 113, 0.1)';
        let profileBorder = 'rgba(248, 113, 113, 0.25)';
        if (team.Core_Chemistry_Profile === 'Domestic Club Blocks') {
            profileColor = '#fbbf24'; // yellow
            profileBg = 'rgba(251, 191, 36, 0.1)';
            profileBorder = 'rgba(251, 191, 36, 0.25)';
        } else if (team.Core_Chemistry_Profile === 'Hybrid Core') {
            profileColor = '#60a5fa'; // blue
            profileBg = 'rgba(96, 165, 250, 0.1)';
            profileBorder = 'rgba(96, 165, 250, 0.25)';
        } else if (team.Core_Chemistry_Profile === 'League Monopoly') {
            profileColor = '#34d399'; // green
            profileBg = 'rgba(52, 211, 153, 0.1)';
            profileBorder = 'rgba(52, 211, 153, 0.25)';
        }
        profileBadge.style.color = profileColor;
        profileBadge.style.backgroundColor = profileBg;
        profileBadge.style.borderColor = profileBorder;

        // Status coloring
        const statusBadge = clone.querySelector('.detail-status-val');
        statusBadge.textContent = team.Group_Status;
        const isAdvanced = team.Group_Status.includes('Advanced');
        if (isAdvanced) {
            statusBadge.style.color = 'var(--accent-green)';
            statusBadge.style.backgroundColor = 'rgba(16, 185, 129, 0.08)';
            statusBadge.style.borderColor = 'rgba(16, 185, 129, 0.2)';
        } else {
            statusBadge.style.color = 'var(--accent-coral)';
            statusBadge.style.backgroundColor = 'rgba(255, 122, 89, 0.08)';
            statusBadge.style.borderColor = 'rgba(255, 122, 89, 0.2)';
        }

        // Synergy Radial fill calculation
        const rating = Number(team.Final_Synergy_Rating);
        clone.getElementById('detail-rating-val').textContent = rating;
        const fillCircle = clone.getElementById('rating-fill-circle');
        
        // Circumference is 2 * PI * r = 2 * 3.14159 * 45 = 282.7
        const circ = 282.7;
        const offset = circ - (rating / 100) * circ;
        
        // Apply radial color based on score tier
        let ratingColor = 'var(--accent-coral)';
        if (rating >= 75) ratingColor = 'var(--accent-green)';
        else if (rating >= 60) ratingColor = 'var(--accent-blue)';
        else if (rating >= 50) ratingColor = 'var(--accent-purple)';
        
        fillCircle.style.stroke = ratingColor;
        
        // Trigger stroke animation on next tick
        setTimeout(() => {
            const el = document.getElementById('rating-fill-circle');
            if (el) el.style.strokeDashoffset = offset;
        }, 50);

        // Core metrics progress bars
        clone.querySelector('.talent-val').textContent = team.Talent_Baseline;
        clone.querySelector('.talent-bar').style.width = `${team.Talent_Baseline * 10}%`;

        clone.querySelector('.cohesion-val').textContent = team.Club_Cohesion;
        clone.querySelector('.cohesion-bar').style.width = `${team.Club_Cohesion * 10}%`;

        clone.querySelector('.alignment-val').textContent = team.Tactical_Alignment;
        clone.querySelector('.alignment-bar').style.width = `${team.Tactical_Alignment * 10}%`;

        clone.querySelector('.chaos-val').textContent = team.Chaos_Quotient;
        clone.querySelector('.chaos-bar').style.width = `${team.Chaos_Quotient * 10}%`;

        // 4. Render Tactical Field players
        const playersContainer = clone.getElementById('field-players');
        const lineup = getLineup(team);
        
        lineup.forEach(p => {
            const pNode = document.createElement('div');
            const nodeClass = p.type === 'domestic' ? 'node-domestic' : 'node-overseas';
            pNode.className = `player-node ${nodeClass}`;
            pNode.style.left = `${p.x}%`;
            pNode.style.top = `${p.y}%`;
            pNode.style.position = 'absolute';
            
            pNode.innerHTML = `
                <div class="player-marker" title="${p.pos}"></div>
                <div class="player-name">${p.name}</div>
            `;
            playersContainer.appendChild(pNode);
        });

        // Insert Template clone into details column
        detailPanel.innerHTML = '';
        detailPanel.appendChild(clone);

        // Add close detail listener for mobile viewport spacing
        document.getElementById('close-detail').addEventListener('click', () => {
            detailPanel.innerHTML = `
                <div class="no-selection glass-panel animate-fade-in">
                    <svg class="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                    <h3>Select a Squad</h3>
                    <p>Click on any national team in the list to visualize their tactical matrix, chemistry variables, and system alignment.</p>
                </div>
            `;
            document.querySelectorAll('.team-card').forEach(c => c.classList.remove('selected'));
        });
    };

    // Helper to extract or generate a realistic tactical layout
    const getLineup = (team) => {
        // If we have an exact layout in the database, use it
        if (tacticalLineups[team.National_Team]) {
            return tacticalLineups[team.National_Team];
        }

        // If no custom layout, generate one procedurally based on chemistry profile
        const positions = [
            { pos: "GK", x: 50, y: 88 },
            { pos: "LCB", x: 35, y: 73 },
            { pos: "RCB", x: 65, y: 73 },
            { pos: "LB", x: 15, y: 68 },
            { pos: "RB", x: 85, y: 68 },
            { pos: "LDM", x: 38, y: 56 },
            { pos: "RDM", x: 62, y: 56 },
            { pos: "AM", x: 50, y: 42 },
            { pos: "LW", x: 20, y: 24 },
            { pos: "RW", x: 80, y: 24 },
            { pos: "ST", x: 50, y: 14 }
        ];

        const profile = team.Core_Chemistry_Profile;
        
        return positions.map((p, idx) => {
            let type = "overseas"; // Default
            
            if (profile === 'League Monopoly') {
                type = "domestic"; // All domestic
            } else if (profile === 'Domestic Club Blocks') {
                // Mostly domestic (e.g. 8 out of 11)
                type = idx !== 5 && idx !== 9 && idx !== 10 ? "domestic" : "overseas";
            } else if (profile === 'Hybrid Core') {
                // Balanced mix (e.g. 5 domestic, 6 overseas)
                type = idx === 0 || idx === 1 || idx === 2 || idx === 6 || idx === 7 ? "domestic" : "overseas";
            } else {
                // Scattered: almost all overseas (e.g. 1 domestic local star, 10 overseas)
                type = idx === 7 ? "domestic" : "overseas";
            }

            // Create generic player name based on position
            const typeLabel = type === 'domestic' ? 'L' : 'O'; // Local vs Overseas
            const playerName = `${team.National_Team} #${idx + 1} (${typeLabel})`;

            return {
                name: playerName,
                pos: p.pos,
                type: type,
                x: p.x,
                y: p.y
            };
        });
    };

    // 4. Setup Event Listeners
    searchInput.addEventListener('input', renderTeams);
    groupSelect.addEventListener('change', renderTeams);
    profileSelect.addEventListener('change', renderTeams);
    statusSelect.addEventListener('change', renderTeams);
    sortSelect.addEventListener('change', renderTeams);

    // Render Scatter Plot
    const renderScatterPlot = () => {
        const svg = document.getElementById('scatter-plot-svg');
        const tooltip = document.getElementById('chart-tooltip');
        if (!svg) return;
        
        svg.innerHTML = '';
        
        const width = 800;
        const height = 420;
        const padding = { top: 30, right: 30, bottom: 50, left: 60 };
        
        const plotWidth = width - padding.left - padding.right;
        const plotHeight = height - padding.top - padding.bottom;
        
        const minX = 3.0, maxX = 10.0;
        const minY = 40.0, maxY = 100.0;
        
        const getX = (val) => padding.left + ((val - minX) / (maxX - minX)) * plotWidth;
        const getY = (val) => padding.top + plotHeight - ((val - minY) / (maxY - minY)) * plotHeight;
        
        // Y Gridlines
        for (let yVal = 40; yVal <= 100; yVal += 10) {
            const yCoor = getY(yVal);
            const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            grid.setAttribute('x1', padding.left);
            grid.setAttribute('y1', yCoor);
            grid.setAttribute('x2', width - padding.right);
            grid.setAttribute('y2', yCoor);
            grid.setAttribute('class', 'axis-grid');
            svg.appendChild(grid);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', padding.left - 10);
            text.setAttribute('y', yCoor + 4);
            text.setAttribute('class', 'axis-ticks');
            text.setAttribute('text-anchor', 'end');
            text.textContent = yVal;
            svg.appendChild(text);
        }
        
        // X Gridlines
        for (let xVal = 3.0; xVal <= 10.0; xVal += 1.0) {
            const xCoor = getX(xVal);
            if (xVal > 3.0) {
                const grid = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                grid.setAttribute('x1', xCoor);
                grid.setAttribute('y1', padding.top);
                grid.setAttribute('x2', xCoor);
                grid.setAttribute('y2', height - padding.bottom);
                grid.setAttribute('class', 'axis-grid');
                svg.appendChild(grid);
            }
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', xCoor);
            text.setAttribute('y', height - padding.bottom + 20);
            text.setAttribute('class', 'axis-ticks');
            text.setAttribute('text-anchor', 'middle');
            text.textContent = xVal.toFixed(1);
            svg.appendChild(text);
        }
        
        // Axes
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxis.setAttribute('x1', padding.left);
        xAxis.setAttribute('y1', height - padding.bottom);
        xAxis.setAttribute('x2', width - padding.right);
        xAxis.setAttribute('y2', height - padding.bottom);
        xAxis.setAttribute('class', 'axis-line');
        svg.appendChild(xAxis);
        
        const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yAxis.setAttribute('x1', padding.left);
        yAxis.setAttribute('y1', padding.top);
        yAxis.setAttribute('x2', padding.left);
        yAxis.setAttribute('y2', height - padding.bottom);
        yAxis.setAttribute('class', 'axis-line');
        svg.appendChild(yAxis);
        
        // Labels
        const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xLabel.setAttribute('x', padding.left + plotWidth / 2);
        xLabel.setAttribute('y', height - padding.bottom + 42);
        xLabel.setAttribute('class', 'axis-label');
        xLabel.setAttribute('text-anchor', 'middle');
        xLabel.textContent = "Individual Talent Baseline (Ti)";
        svg.appendChild(xLabel);
        
        const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yLabel.setAttribute('transform', `rotate(-90, ${padding.left - 42}, ${padding.top + plotHeight / 2})`);
        yLabel.setAttribute('x', padding.left - 42);
        yLabel.setAttribute('y', padding.top + plotHeight / 2);
        yLabel.setAttribute('class', 'axis-label');
        yLabel.setAttribute('text-anchor', 'middle');
        yLabel.textContent = "Calculated Synergy Rating";
        svg.appendChild(yLabel);
        
        // Diagonal Baseline (Synergy = Talent x 10)
        const diagStart = { x: getX(4.0), y: getY(40.0) };
        const diagEnd = { x: getX(10.0), y: getY(100.0) };
        const diagonal = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        diagonal.setAttribute('x1', diagStart.x);
        diagonal.setAttribute('y1', diagStart.y);
        diagonal.setAttribute('x2', diagEnd.x);
        diagonal.setAttribute('y2', diagEnd.y);
        diagonal.setAttribute('class', 'baseline-guide');
        svg.appendChild(diagonal);
        
        const diagText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        diagText.setAttribute('x', diagEnd.x - 110);
        diagText.setAttribute('y', diagEnd.y + 18);
        diagText.setAttribute('class', 'baseline-text');
        diagText.textContent = "Talent Baseline (Synergy = Talent x 10)";
        svg.appendChild(diagText);

        // Hover Crosshairs
        const guideX = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        guideX.setAttribute('class', 'projection-guide');
        guideX.setAttribute('id', 'guide-line-x');
        svg.appendChild(guideX);
        
        const guideY = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        guideY.setAttribute('class', 'projection-guide');
        guideY.setAttribute('id', 'guide-line-y');
        svg.appendChild(guideY);
        
        // Dots
        teamsData.forEach(team => {
            const xVal = Number(team.Talent_Baseline);
            const yVal = Number(team.Final_Synergy_Rating);
            const cx = getX(xVal);
            const cy = getY(yVal);
            
            const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            dot.setAttribute('cx', cx);
            dot.setAttribute('cy', cy);
            dot.setAttribute('r', 6);
            
            let profileClass = 'dot-scattered';
            if (team.Core_Chemistry_Profile === 'Domestic Club Blocks') profileClass = 'dot-blocks';
            else if (team.Core_Chemistry_Profile === 'Hybrid Core') profileClass = 'dot-hybrid';
            else if (team.Core_Chemistry_Profile === 'League Monopoly') profileClass = 'dot-monopoly';
            
            dot.setAttribute('class', `plot-dot ${profileClass}`);
            dot.setAttribute('id', `plot-dot-${team.National_Team.replace(/\s+/g, '-')}`);
            
            if (selectedTeam && selectedTeam.National_Team === team.National_Team) {
                dot.classList.add('dot-selected');
            }

            dot.addEventListener('mouseover', () => {
                guideX.setAttribute('x1', cx);
                guideX.setAttribute('y1', cy);
                guideX.setAttribute('x2', cx);
                guideX.setAttribute('y2', height - padding.bottom);
                guideX.style.stroke = 'currentColor';
                guideX.style.color = getComputedStyle(dot).fill;
                guideX.classList.add('projection-active');
                
                guideY.setAttribute('x1', padding.left);
                guideY.setAttribute('y1', cy);
                guideY.setAttribute('x2', cx);
                guideY.setAttribute('y2', cy);
                guideY.style.stroke = 'currentColor';
                guideY.style.color = getComputedStyle(dot).fill;
                guideY.classList.add('projection-active');
                
                tooltip.style.opacity = 1;
                
                const chartBounds = svg.getBoundingClientRect();
                const containerBounds = svg.parentElement.getBoundingClientRect();
                
                const clientX = (cx / width) * chartBounds.width;
                const clientY = (cy / height) * chartBounds.height;
                
                tooltip.style.left = `${clientX + (chartBounds.left - containerBounds.left)}px`;
                tooltip.style.top = `${clientY + (chartBounds.top - containerBounds.top)}px`;
                
                tooltip.innerHTML = `
                    <div class="tooltip-team">${team.National_Team}</div>
                    <div class="tooltip-row"><span>Group / Status</span><strong>${team.Group} / ${team.Group_Status.split(' ')[0]}</strong></div>
                    <div class="tooltip-row"><span>Talent (Ti)</span><strong>${team.Talent_Baseline}</strong></div>
                    <div class="tooltip-row"><span>Cohesion (Cd)</span><strong>${team.Club_Cohesion}</strong></div>
                    <div class="tooltip-row"><span>Synergy Rating</span><strong class="tooltip-synergy">${team.Final_Synergy_Rating}</strong></div>
                `;
                
                const teamRow = document.getElementById(`team-card-${team.National_Team.replace(/\s+/g, '-')}`);
                if (teamRow) teamRow.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            });
            
            dot.addEventListener('mouseout', () => {
                guideX.classList.remove('projection-active');
                guideY.classList.remove('projection-active');
                tooltip.style.opacity = 0;
                
                const teamRow = document.getElementById(`team-card-${team.National_Team.replace(/\s+/g, '-')}`);
                if (teamRow && (!selectedTeam || selectedTeam.National_Team !== team.National_Team)) {
                    teamRow.style.borderColor = 'var(--border-color)';
                }
            });
            
            dot.addEventListener('click', () => {
                document.querySelectorAll('.plot-dot').forEach(d => d.classList.remove('dot-selected'));
                dot.classList.add('dot-selected');
                
                const teamRow = document.getElementById(`team-card-${team.National_Team.replace(/\s+/g, '-')}`);
                if (teamRow) {
                    teamRow.click();
                    teamRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            });
            
            svg.appendChild(dot);
        });
    };

    const updateScatterPlotFilters = (filteredTeams) => {
        const filteredNames = new Set(filteredTeams.map(t => t.National_Team));
        teamsData.forEach(team => {
            const dot = document.getElementById(`plot-dot-${team.National_Team.replace(/\s+/g, '-')}`);
            if (dot) {
                if (filteredNames.has(team.National_Team)) {
                    dot.classList.remove('dot-faded');
                } else {
                    dot.classList.add('dot-faded');
                }
            }
        });
    };

    // Initial Loading trigger
    loadTeamsData();
});
