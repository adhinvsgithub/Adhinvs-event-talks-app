document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('schedule-container');
    const categoryFiltersContainer = document.getElementById('category-filters');
    let allTalks = [];

    fetch('/api/talks')
        .then(response => response.json())
        .then(data => {
            allTalks = data;
            renderSchedule(allTalks);
            renderCategoryFilters(allTalks);
        });

    function renderSchedule(talks) {
        scheduleContainer.innerHTML = '';
        talks.forEach(talk => {
            const talkElement = document.createElement('div');
            talkElement.classList.add(talk.isBreak ? 'break' : 'talk');

            const time = `${new Date(talk.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(talk.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

            if (talk.isBreak) {
                talkElement.innerHTML = `
                    <div class="time">${time}</div>
                    <div class="details">${talk.title}</div>
                `;
            } else {
                talkElement.innerHTML = `
                    <div class="time">${time}</div>
                    <div class="details">
                        <h2>${talk.title}</h2>
                        <div class="speakers">By: ${talk.speakers.join(', ')}</div>
                        <p>${talk.description}</p>
                        <div>
                            ${talk.category.map(cat => `<span class="talk-category">${cat}</span>`).join('')}
                        </div>
                    </div>
                `;
            }
            scheduleContainer.appendChild(talkElement);
        });
    }

    function renderCategoryFilters(talks) {
        const allCategories = [...new Set(talks.flatMap(talk => talk.category).filter(Boolean))];
        
        categoryFiltersContainer.innerHTML = '<div class="category-tag active" data-category="all">All</div>';
        allCategories.forEach(category => {
            const tag = document.createElement('div');
            tag.classList.add('category-tag');
            tag.textContent = category;
            tag.dataset.category = category;
            categoryFiltersContainer.appendChild(tag);
        });

        categoryFiltersContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-tag')) {
                const selectedCategory = e.target.dataset.category;
                
                document.querySelectorAll('.category-tag').forEach(tag => tag.classList.remove('active'));
                e.target.classList.add('active');

                if (selectedCategory === 'all') {
                    renderSchedule(allTalks);
                } else {
                    const filteredTalks = allTalks.filter(talk => talk.isBreak || (talk.category && talk.category.includes(selectedCategory)));
                    renderSchedule(filteredTalks);
                }
            }
        });
    }
});
