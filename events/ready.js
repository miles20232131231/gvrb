import { ActivityType } from 'discord.js';

export default {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`${client.user?.username} - (${client.user?.id})`);

        const statuses = [
            {
                type: ActivityType.Playing,
                name: "in a GVRB session",
                status: "online"
            }
        ];

        let currentIndex = 0;

        function setActivity() {
            const status = statuses[currentIndex];
            client.user.setActivity(status.name, { type: status.type });
            client.user.setStatus(status.status);

            currentIndex = (currentIndex + 1) % statuses.length;
        }

        setActivity();

        setInterval(() => {
            setActivity();
        }, 10000);
    },
};
