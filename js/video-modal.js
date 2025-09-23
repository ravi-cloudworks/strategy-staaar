// Video Selection Modal
export class VideoModal {
    constructor() {
        this.modal = null;
        this.init();
    }

    init() {
        this.createModalHTML();
        this.setupEventListeners();
    }

    createModalHTML() {
        let modal = document.getElementById('videoModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'videoModal';
            modal.className = 'crop-modal';
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="crop-container" style="max-width: 800px; max-height: 80vh; overflow-y: auto;">
                <!-- Header -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                            <i class="bi bi-play-circle" style="color: white; font-size: 18px;"></i>
                        </div>
                        <div>
                            <h2 style="margin: 0; font-size: 20px; font-weight: 600; color: #1e293b;">Select Video</h2>
                            <p style="margin: 0; font-size: 14px; color: #64748b;">Choose from server videos or upload your own</p>
                        </div>
                    </div>
                    <button id="closeVideoModal" style="width: 32px; height: 32px; border: none; background: #f1f5f9; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
                        <i class="bi bi-x" style="font-size: 18px; color: #64748b;"></i>
                    </button>
                </div>

                <!-- Upload Section -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <i class="bi bi-upload" style="color: #10b981; font-size: 16px;"></i>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">Upload from Computer</h3>
                    </div>
                    <input type="file" id="modalVideoInput" accept="video/*" style="display: none;">
                    <button id="modalUploadBtn" style="width: 100%; padding: 12px; border: 1px dashed #cbd5e1; background: white; color: #64748b; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="bi bi-cloud-upload" style="font-size: 16px;"></i>
                        Choose Video File
                    </button>
                </div>

                <!-- Available Videos Section -->
                <div style="background: #f8fafc; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                        <i class="bi bi-collection-play" style="color: #3b82f6; font-size: 16px;"></i>
                        <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b;">Available Videos</h3>
                    </div>
                    <div id="serverVideosList" style="display: grid; gap: 12px;">
                        <!-- Loading state -->
                        <div id="videosLoading" style="text-align: center; padding: 40px; color: #64748b;">
                            <i class="bi bi-hourglass-split" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                            Loading videos...
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.modal = modal;
    }

    setupEventListeners() {
        // Close modal
        document.getElementById('closeVideoModal').addEventListener('click', () => {
            this.close();
        });

        // Upload button
        document.getElementById('modalUploadBtn').addEventListener('click', () => {
            document.getElementById('modalVideoInput').click();
        });

        // Handle video upload
        document.getElementById('modalVideoInput').addEventListener('change', (e) => {
            this.handleVideoUpload(e);
        });
    }

    open() {
        this.modal.classList.add('show');
        this.loadServerVideos();
    }

    close() {
        this.modal.classList.remove('show');
    }

    handleVideoUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const videoPlayer = document.getElementById('videoPlayer');
            const url = URL.createObjectURL(file);
            videoPlayer.src = url;
            this.close();
            Utils.showStatus(`Video "${file.name}" loaded successfully!`, 'success');
        }
    }

    async loadServerVideos() {
        const serverVideosList = document.getElementById('serverVideosList');
        const videosLoading = document.getElementById('videosLoading');

        if (!serverVideosList) return;

        // Show loading state
        if (videosLoading) {
            videosLoading.style.display = 'block';
        }

        try {
            // Get video files from the list
            const videoFilenames = await this.getVideoFileList();
            const videos = [];

            // Process each video file
            for (const filename of videoFilenames) {
                try {
                    const videoPath = `./videos/${filename}`;
                    const metadata = this.parseVideoMetadata(filename);
                    const duration = await this.getVideoDuration(videoPath);

                    videos.push({
                        ...metadata,
                        duration: duration,
                        path: videoPath
                    });
                } catch (error) {
                    console.warn(`Could not process ${filename}:`, error);
                }
            }

            // Hide loading state
            if (videosLoading) {
                videosLoading.style.display = 'none';
            }

            if (videos.length === 0) {
                serverVideosList.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #64748b;">
                        <i class="bi bi-camera-video" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                        No videos available.<br><br>
                        <small style="color: #94a3b8;">Add video files to ./videos/ folder</small>
                    </div>
                `;
                return;
            }

            // Clear and populate videos
            serverVideosList.innerHTML = '';
            videos.forEach((video) => {
                const videoItem = this.createVideoItem(video);
                serverVideosList.appendChild(videoItem);
            });

        } catch (error) {
            console.error('Error loading videos:', error);
            if (videosLoading) {
                videosLoading.style.display = 'none';
            }
            serverVideosList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #dc2626;">
                    <i class="bi bi-exclamation-triangle" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    Error loading videos
                </div>
            `;
        }
    }

    async getVideoFileList() {
        try {
            // Since we can't directly read directory contents from browser,
            // we'll use a known list of video files or try to fetch them
            const knownVideos = [
                'Apple_iPhone15_2023_Tech_Global_YoungAdults.mp4',
                'CocaCola_ShareACoke_2024_Beverage_UK_Teens.mp4',
                'Nike_JustDoIt_2024_Sports_US_Athlete.mp4'
            ];

            // Verify which videos actually exist
            const availableVideos = [];
            for (const video of knownVideos) {
                try {
                    const response = await fetch(`./videos/${video}`, { method: 'HEAD' });
                    if (response.ok) {
                        availableVideos.push(video);
                    }
                } catch (e) {
                    console.log(`Video ${video} not found`);
                }
            }

            return availableVideos;
        } catch (error) {
            console.error('Could not load video-list.txt:', error);
            return [];
        }
    }

    parseVideoMetadata(filename) {
        // Parse filename format: BrandName_CampaignName_Year_Industry_Country_Target.mp4
        try {
            // Remove .mp4 extension
            const nameWithoutExt = filename.replace('.mp4', '');

            // Split by underscore
            const parts = nameWithoutExt.split('_');

            if (parts.length !== 6) {
                console.warn(`Filename ${filename} does not match expected format: BrandName_CampaignName_Year_Industry_Country_Target.mp4`);
                return {
                    filename: filename,
                    brand: 'Unknown',
                    campaign: 'Unknown',
                    year: 'Unknown',
                    industry: 'Unknown',
                    country: 'Unknown',
                    target: 'Unknown'
                };
            }

            const [brandName, campaignName, year, industry, country, target] = parts;

            return {
                filename: filename,
                brand: brandName,
                campaign: campaignName,
                year: year,
                industry: industry,
                country: country,
                target: target,
                displayName: `${brandName} - ${campaignName}`,
                description: `${year} ${industry} campaign targeting ${target} in ${country}`
            };
        } catch (error) {
            console.error(`Error parsing video metadata for ${filename}:`, error);
            return {
                filename: filename,
                brand: 'Unknown',
                campaign: 'Unknown',
                year: 'Unknown',
                industry: 'Unknown',
                country: 'Unknown',
                target: 'Unknown'
            };
        }
    }


    getVideoDuration(videoSrc) {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                const duration = video.duration;
                const minutes = Math.floor(duration / 60);
                const seconds = Math.floor(duration % 60);
                resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
            };
            video.onerror = () => resolve('--:--');
            video.src = videoSrc;
        });
    }

    createVideoItem(video) {
        const videoItem = document.createElement('div');
        videoItem.style.cssText = `
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 12px;
        `;

        // Thumbnail container
        const thumbnailContainer = document.createElement('div');
        thumbnailContainer.style.cssText = `
            width: 80px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        `;

        // Video thumbnail
        const videoElement = document.createElement('video');
        videoElement.style.cssText = `
            width: 80px;
            height: 60px;
            border-radius: 8px;
            object-fit: cover;
            background: #f1f5f9;
        `;
        videoElement.muted = true;
        videoElement.preload = 'metadata';
        videoElement.src = `${video.path}#t=1`;

        // Play icon overlay
        const playIcon = document.createElement('div');
        playIcon.innerHTML = '<i class="bi bi-play-fill" style="color: white; font-size: 24px;"></i>';
        playIcon.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.6);
            border-radius: 50%;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2;
        `;

        thumbnailContainer.appendChild(videoElement);
        thumbnailContainer.appendChild(playIcon);

        // Video info
        const infoSection = document.createElement('div');
        infoSection.style.cssText = 'flex: 1;';
        infoSection.innerHTML = `
            <div style="font-weight: 600; color: #1e293b; margin-bottom: 6px; font-size: 14px; display: flex; align-items: center; gap: 8px;">
                <i class="bi bi-play-circle" style="color: #3b82f6;"></i>
                ${video.brand} - ${video.campaign}
                <span style="background: #e5e7eb; padding: 1px 6px; border-radius: 6px; font-size: 10px; color: #6b7280; font-weight: 500;">${video.year}</span>
            </div>
            <div style="font-size: 11px; color: #64748b; margin-bottom: 8px; display: flex; gap: 6px; flex-wrap: wrap;">
                <span style="background: #f1f5f9; padding: 2px 6px; border-radius: 8px; display: flex; align-items: center; gap: 3px; font-weight: 500;">
                    <i class="bi bi-building" style="font-size: 9px; color: #3b82f6;"></i>${video.industry}
                </span>
                <span style="background: #fef3c7; padding: 2px 6px; border-radius: 8px; display: flex; align-items: center; gap: 3px; font-weight: 500;">
                    <i class="bi bi-geo-alt" style="font-size: 9px; color: #f59e0b;"></i>${video.country}
                </span>
                <span style="background: #dbeafe; padding: 2px 6px; border-radius: 8px; display: flex; align-items: center; gap: 3px; font-weight: 500;">
                    <i class="bi bi-people" style="font-size: 9px; color: #3b82f6;"></i>${video.target}
                </span>
            </div>
            <div style="font-size: 11px; color: #94a3b8; display: flex; align-items: center; gap: 6px;">
                <span style="display: flex; align-items: center; gap: 3px;">
                    <i class="bi bi-clock" style="font-size: 9px;"></i>${video.duration}
                </span>
                <span>•</span>
                <span>Click to load video</span>
            </div>
        `;

        // Load button
        const loadButton = document.createElement('button');
        loadButton.innerHTML = '<i class="bi bi-play-circle" style="margin-right: 4px;"></i>Load';
        loadButton.style.cssText = `
            padding: 8px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        `;

        // Assemble the video item
        videoItem.appendChild(thumbnailContainer);
        videoItem.appendChild(infoSection);
        videoItem.appendChild(loadButton);

        // Add hover effects
        videoItem.addEventListener('mouseenter', function () {
            this.style.borderColor = '#667eea';
            this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.15)';
            this.style.transform = 'translateY(-2px)';
            loadButton.style.background = 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)';
        });

        videoItem.addEventListener('mouseleave', function () {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = 'none';
            this.style.transform = 'translateY(0)';
            loadButton.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        });

        // Add click handler to load video
        const loadVideoHandler = () => {
            const videoPlayer = document.getElementById('videoPlayer');
            videoPlayer.src = video.path;
            this.close();
            Utils.showStatus(`Video "${video.brand} - ${video.campaign}" loaded successfully!`, 'success');
        };

        videoItem.addEventListener('click', loadVideoHandler);
        loadButton.addEventListener('click', (e) => {
            e.stopPropagation();
            loadVideoHandler();
        });

        return videoItem;
    }
}