using System;

namespace VisitIt.Backend.Exceptions { 
    public class BannedUserException : Exception
    {
        public BannedUserException(string message) : base(message) { }
    }
}