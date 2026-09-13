/**
 * RightMotion Remote Access — Base Transport Adapter Interface
 */

class BaseTransport {
  constructor(name) {
    this.name = name;
  }

  /**
   * Starts the public transport endpoint.
   * @param {number} port Local port being served
   * @returns {Promise<{ success: boolean, publicUrl: string|null, error: string|null }>}
   */
  async start(port) {
    throw new Error('start() must be implemented by transport adapter');
  }

  /**
   * Stops the public transport endpoint.
   * @returns {Promise<{ success: boolean }>}
   */
  async stop() {
    throw new Error('stop() must be implemented by transport adapter');
  }

  /**
   * Gets current public URL if active.
   * @returns {string|null}
   */
  getPublicUrl() {
    return null;
  }

  /**
   * Gets current status of transport adapter.
   * @returns {{ status: 'online' | 'offline' | 'unavailable' | 'error', error: string|null }}
   */
  getStatus() {
    return { status: 'offline', error: null };
  }
}

module.exports = BaseTransport;
