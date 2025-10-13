// js/injectStyles.js
export function injectAlertKitStyles() {
    if (typeof window === 'undefined') return;

    if (document.getElementById('alert-kit-style')) return; // evita duplicación

    const style = document.createElement('style');
    style.id = 'alert-kit-style';
    style.textContent = `
            /* Alert Kit */
            /* Copyright (c) 2025 XanderLs <xanderlsdev@gmail.com> */
            /* MIT License */
            /* https://github.com/xanderlsdev/alert-kit */
            /* Version: 1.0.0 */

            .alert-kit-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                font-family: inherit;
                font-size: 1rem;
                color: inherit;
            }

            .alert-kit-overlay.alert-kit-backdrop-blur {
                backdrop-filter: blur(5px);
            }

            .alert-kit-content {
                position: relative;
                background-color: white;
                border-radius: 0.5rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                width: 90%;
                max-width: 500px;
                /* animation: alertKitSlideIn 0.3s ease-out; */
                animation: alertKitSlideIn 0.3s;
                position: absolute;
            }

            .alert-kit-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #00000012;
                padding: 0.87rem 1rem;
                border-bottom: 1px solid #dee2e6;
            }

            .alert-kit-header.alert-kit-cursor-move {
                cursor: move;
            }

            .alert-kit-header .alert-kit-header-p {
                margin: 0;
                padding: 0;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 500;
                color: inherit;
            }

            .alert-kit-header .alert-kit-close {
                background: none;
                border: none;
                font-size: 2.2rem;
                line-height: 2.5rem;
                cursor: pointer;
                color: #666;
                padding: 5px;
                line-height: 1;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background-color 0.3s;
            }

            .alert-kit-header .alert-kit-close:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }

            .alert-kit-header .alert-kit-close:focus {
                outline: none;
                border-color: #4A90E2;
                box-shadow: 0 0 0 2px #fff, 0 0 0 4px #4A90E2;
                background-color: rgba(0, 0, 0, 0.05);
            }

            .alert-kit-header .alert-kit-close:focus-visible {
                outline: none;
                border-color: #4A90E2;
                box-shadow: 0 0 0 2px #fff, 0 0 0 4px #4A90E2;
                background-color: rgba(0, 0, 0, 0.05);
            }

            .alert-kit-header .alert-kit-close:active {
                transform: scale(0.95);
            }

            @keyframes alertKitSlideIn {
                0% {
                    -webkit-transform: scale(0.7);
                    transform: scale(0.7);
                }

                45% {
                    -webkit-transform: scale(1.05);
                    transform: scale(1.05);
                }

                80% {
                    -webkit-transform: scale(0.95);
                    transform: scale(0.95);
                }

                100% {
                    -webkit-transform: scale(1);
                    transform: scale(1);
                }

                /* from {
                    transform: translateY(-50px);
                    opacity: 0;
                }

                to {
                    transform: translateY(0);
                    opacity: 1;
                } */
            }

            .alert-kit-body {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: start;
                padding: 1rem;
                gap: 1rem;
            }

            .alert-kit-body .alert-kit-icon {
                /* width: 70px;
                height: 70px;
                min-width: 70px; */
                /* border-radius: 50%; */
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .alert-kit-body .alert-kit-icon.error {
                /* background-color: #ff4444; */
                /* border: 1px solid #ff4444; */
                color: #ff4444;
            }

            .alert-kit-body .alert-kit-icon.warning {
                /* background-color: #ffa500; */
                /* border: 1px solid #ffa500; */
                color: #ffa500;
            }

            .alert-kit-body .alert-kit-icon.info {
                /* background-color: #2196F3; */
                /* border: 1px solid #2196F3; */
                color: #2196F3;
            }

            .alert-kit-body .alert-kit-icon.question {
                /* background-color: #7e7e7e; */
                /* border: 1px solid #7e7e7e; */
                color: #7e7e7e;
            }

            .alert-kit-body .alert-kit-icon.success {
                /* background-color: #4CAF50; */
                /* border: 1px solid #4CAF50; */
                color: #4CAF50;
            }
            
            .alert-kit-body .alert-kit-body-content {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .alert-kit-body .alert-kit-body-content .alert-kit-body-content-h2 {
                color: inherit;
                margin: 0;
                font-size: 1.125rem;
                line-height: 1.75rem;
                font-weight: 600;
            }

            .alert-kit-body .alert-kit-body-content .alert-kit-body-content-p {
                color: inherit;
                margin: 0;
                font-size: 1rem;
                line-height: 1.5rem;
                font-weight: 300;
            }

            .alert-kit-footer {
                display: flex;
                justify-content: flex-end;
                padding: 0rem 1rem 0.87rem 1rem;
            }

            .alert-kit-footer>* {
                margin: .25rem;
            }

            .alert-kit-footer button.alert-kit-button {
                background-color: #ff4444;
                color: white;
                border: none;
                padding: 0.611em 1rem;
                font-size: 0.9rem;
                cursor: pointer;
                line-height: 1.5;
                border-radius: .25rem;
                transition: background-color 0.3s;
            }

            .alert-kit-footer button.alert-kit-button.error {
                background-color: #ff4444;
            }

            .alert-kit-footer button.alert-kit-button.error:hover {
                background-color: #ff2020;
            }

            .alert-kit-footer button.alert-kit-button.warning {
                background-color: #ffa500;
            }

            .alert-kit-footer button.alert-kit-button.warning:hover {
                background-color: #ff8c00;
            }

            .alert-kit-footer button.alert-kit-button.info {
                background-color: #2196F3;
            }

            .alert-kit-footer button.alert-kit-button.info:hover {
                background-color: #1976D2;
            }

            .alert-kit-footer button.alert-kit-button.question {
                background-color: #7e7e7e;
            }

            .alert-kit-footer button.alert-kit-button.question:hover {
                background-color: #7e7e7e;
            }

            .alert-kit-footer button.alert-kit-button.success {
                background-color: #4CAF50;
            }

            .alert-kit-footer button.alert-kit-button.success:hover {
                background-color: #45a049;
            }

            .alert-kit-footer button.alert-kit-button:focus {
                outline: none;
                border-color: #4A90E2;
                box-shadow: 0 0 0 2px #fff, 0 0 0 4px #4A90E2;
            }

            .alert-kit-footer button.alert-kit-button:focus-visible {
                outline: none;
                border-color: #4A90E2;
                box-shadow: 0 0 0 2px #fff, 0 0 0 4px #4A90E2;
            }

            .alert-kit-footer button.alert-kit-button:active {
                transform: scale(0.95);
            }

            .alert-kit-overlay .alert-kit-closing {
                /* animation: alertKitSlideOut 0.3s ease-in forwards; */
                animation: alertKitSlideOut 0.2s forwards;
            }

            @keyframes alertKitSlideOut {
                0% {
                    -webkit-transform: scale(1);
                    transform: scale(1);
                    opacity: 1;
                }

                100% {
                    -webkit-transform: scale(0.5);
                    transform: scale(0.5);
                    opacity: 0;
                }

                /* from {
                    transform: translateY(0);
                    opacity: 1;
                }

                to {
                    transform: translateY(-50px);
                    opacity: 0;
                } */
            }

            .alert-kit-loading-container {
                background-color: transparent;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                color: white;
                outline: none;
            }

            .alert-kit-loading-container p {
                font-size: 1rem;
                font-weight: 400;
            }

            .alert-kit-loading-spinner {
                width: 50px;
                aspect-ratio: 1;
                border-radius: 50%;
                border: 8px solid #ffffff;
                animation:
                    alert-kit-l20-1 0.8s infinite linear alternate,
                    alert-kit-l20-2 1.6s infinite linear;
            }

            @keyframes alert-kit-l20-1 {
                0% {
                    clip-path: polygon(50% 50%, 0 0, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)
                }

                12.5% {
                    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 0%, 100% 0%, 100% 0%)
                }

                25% {
                    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 100% 100%, 100% 100%)
                }

                50% {
                    clip-path: polygon(50% 50%, 0 0, 50% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)
                }

                62.5% {
                    clip-path: polygon(50% 50%, 100% 0, 100% 0%, 100% 0%, 100% 100%, 50% 100%, 0% 100%)
                }

                75% {
                    clip-path: polygon(50% 50%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 50% 100%, 0% 100%)
                }

                100% {
                    clip-path: polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%)
                }
            }

            @keyframes alert-kit-l20-2 {
                0% {
                    transform: scaleY(1) rotate(0deg)
                }

                49.99% {
                    transform: scaleY(1) rotate(135deg)
                }

                50% {
                    transform: scaleY(-1) rotate(0deg)
                }

                100% {
                    transform: scaleY(-1) rotate(-135deg)
                }
            }
    `;
    document.head.appendChild(style);
}
