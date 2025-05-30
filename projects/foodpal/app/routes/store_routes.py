from flask import Blueprint, request, jsonify
from ..services.store_service import StoreService
from ..services.driver_service import DriverService
from .main import send_update
import logging

logger = logging.getLogger(__name__)
store_bp = Blueprint('store', __name__)

# Initialize services
driver_service = DriverService()
store_service = StoreService(driver_service)

@store_bp.route("/find_stores", methods=["GET"])
def find_stores():
    """Find stores near the given address."""
    try:
        address = request.args.get("address")
        if not address:
            return jsonify({"error": "No address provided"}), 400
        
        send_update("Opening Doordash")
        stores = store_service.find_stores(address)
        
        return jsonify({
            "success": True,
            "stores": stores
        })
        
    except Exception as e:
        logger.error(f"Error in find_stores: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@store_bp.route("/select_store", methods=["POST"])
def select_store():
    """Select a store and navigate to its page."""
    try:
        data = request.get_json()
        if not data or 'store_name' not in data:
            return jsonify({"error": "No store name provided"}), 400
        
        store_name = data['store_name']
        send_update(f"Selecting store: {store_name}")
        
        # TODO: Implement store selection logic
        # This will be implemented in the StoreService class
        
        return jsonify({
            "success": True,
            "message": f"Selected store: {store_name}"
        })
        
    except Exception as e:
        logger.error(f"Error in select_store: {str(e)}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500 